// Reads the compiler versions embedded in a Klever contract ABI from an uploaded
// project zip. `ksc` writes them into output/*.abi.json under `buildInfo`:
//   buildInfo.framework.version -> KSC version (e.g. "0.45.0")
//   buildInfo.rustc.version     -> Rust version (e.g. "1.90.0")
// Used to auto-fill the KSC/Rust fields when a user selects their zip.
//
// Implemented with the native DecompressionStream (no zip dependency) and is
// best-effort: any parsing/format failure returns null so the user can still
// type the versions manually.

export interface BuildVersions {
  kscVersion?: string;
  rustVersion?: string;
}

// Matches an ABI file under an output/ directory anywhere in the archive.
const ABI_RE = /(^|\/)output\/[^/]*\.abi\.json$/i;

const EOCD_SIG = 0x06054b50; // End Of Central Directory
const CD_SIG = 0x02014b50; // Central directory file header
const LF_SIG = 0x04034b50; // Local file header

interface RawEntry {
  bytes: Uint8Array;
  method: number;
}

export async function readBuildVersionsFromZip(
  file: File,
): Promise<BuildVersions | null> {
  try {
    const buf = new Uint8Array(await file.arrayBuffer());
    const entry = findAbiEntry(buf);
    if (!entry) return null;

    const data = await inflate(entry.bytes, entry.method);
    if (!data) return null;

    const json = JSON.parse(new TextDecoder().decode(data));
    const ksc = json?.buildInfo?.framework?.version;
    const rust = json?.buildInfo?.rustc?.version;
    if (typeof ksc !== 'string' && typeof rust !== 'string') return null;

    return {
      kscVersion: typeof ksc === 'string' ? ksc : undefined,
      rustVersion: typeof rust === 'string' ? rust : undefined,
    };
  } catch {
    return null;
  }
}

// Locates the output/*.abi.json entry via the zip central directory and returns
// its raw (still-compressed) bytes plus the compression method.
function findAbiEntry(buf: Uint8Array): RawEntry | null {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  // Scan backwards for the End Of Central Directory record.
  let eocd = -1;
  const minPos = Math.max(0, buf.length - 22 - 0xffff);
  for (let i = buf.length - 22; i >= minPos; i--) {
    if (dv.getUint32(i, true) === EOCD_SIG) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;

  const count = dv.getUint16(eocd + 10, true);
  const decoder = new TextDecoder();
  let p = dv.getUint32(eocd + 16, true); // central directory offset

  for (let i = 0; i < count; i++) {
    if (p + 46 > buf.length || dv.getUint32(p, true) !== CD_SIG) break;
    const method = dv.getUint16(p + 10, true);
    const compSize = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOff = dv.getUint32(p + 42, true);
    const name = decoder.decode(buf.subarray(p + 46, p + 46 + nameLen));

    if (ABI_RE.test(name)) {
      // The local header's own name/extra lengths give the true data offset
      // (its extra field may differ from the central directory's).
      if (localOff + 30 > buf.length || dv.getUint32(localOff, true) !== LF_SIG)
        return null;
      const lNameLen = dv.getUint16(localOff + 26, true);
      const lExtraLen = dv.getUint16(localOff + 28, true);
      const dataStart = localOff + 30 + lNameLen + lExtraLen;
      if (dataStart + compSize > buf.length) return null;
      return { bytes: buf.subarray(dataStart, dataStart + compSize), method };
    }

    p += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

async function inflate(
  bytes: Uint8Array,
  method: number,
): Promise<Uint8Array | null> {
  if (method === 0) return bytes; // stored, uncompressed
  if (method !== 8) return null; // only deflate is expected
  if (typeof DecompressionStream === 'undefined') return null;

  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([bytes]).stream().pipeThrough(ds);
  const buffer = await new Response(stream).arrayBuffer();
  // Guard against a maliciously oversized ABI decompressing into memory.
  const MAX_DECOMPRESSED_BYTES = 10 * 1024 * 1024;
  if (buffer.byteLength > MAX_DECOMPRESSED_BYTES) return null;
  return new Uint8Array(buffer);
}
