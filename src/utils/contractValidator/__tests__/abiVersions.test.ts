import { TextDecoder, TextEncoder } from 'util';

// jsdom doesn't expose these globally; the util (and this test) use them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).TextEncoder = (global as any).TextEncoder || TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).TextDecoder = (global as any).TextDecoder || TextDecoder;

import { readBuildVersionsFromZip } from '../abiVersions';

// Builds a minimal, valid zip containing a single STORED (uncompressed) entry,
// so the parser can be exercised without needing DecompressionStream.
function buildStoredZip(name: string, content: string): Uint8Array {
  const enc = new TextEncoder();
  const nameBytes = enc.encode(name);
  const data = enc.encode(content);
  const n = data.length;
  const nLen = nameBytes.length;

  const buf = new Uint8Array(30 + nLen + n + (46 + nLen) + 22);
  const dv = new DataView(buf.buffer);
  let o = 0;
  const u32 = (v: number) => {
    dv.setUint32(o, v, true);
    o += 4;
  };
  const u16 = (v: number) => {
    dv.setUint16(o, v, true);
    o += 2;
  };

  // Local file header
  u32(0x04034b50);
  u16(20); // version needed
  u16(0); // flags
  u16(0); // method: stored
  u16(0); // time
  u16(0); // date
  u32(0); // crc
  u32(n); // compressed size
  u32(n); // uncompressed size
  u16(nLen);
  u16(0); // extra len
  buf.set(nameBytes, o);
  o += nLen;
  buf.set(data, o);
  o += n;

  // Central directory
  const cdOffset = o;
  u32(0x02014b50);
  u16(20); // version made by
  u16(20); // version needed
  u16(0); // flags
  u16(0); // method
  u16(0); // time
  u16(0); // date
  u32(0); // crc
  u32(n); // compressed size
  u32(n); // uncompressed size
  u16(nLen);
  u16(0); // extra len
  u16(0); // comment len
  u16(0); // disk start
  u16(0); // internal attrs
  u32(0); // external attrs
  u32(0); // local header offset
  buf.set(nameBytes, o);
  o += nLen;
  const cdSize = o - cdOffset;

  // End of central directory
  u32(0x06054b50);
  u16(0); // disk
  u16(0); // cd start disk
  u16(1); // entries this disk
  u16(1); // total entries
  u32(cdSize);
  u32(cdOffset);
  u16(0); // comment len

  return buf;
}

const ABI = JSON.stringify({
  buildInfo: {
    rustc: { version: '1.90.0' },
    framework: { name: 'klever-sc', version: '0.45.0' },
  },
  name: 'Adder',
});

// The util only reads file.arrayBuffer(); stub it so the parser receives the
// exact bytes regardless of the test env's Blob/File implementation.
function fileFrom(bytes: Uint8Array): File {
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { arrayBuffer: async () => ab } as any as File;
}

describe('readBuildVersionsFromZip', () => {
  it('extracts KSC and Rust versions from output/*.abi.json', async () => {
    const zip = buildStoredZip('adder/output/adder.abi.json', ABI);
    await expect(readBuildVersionsFromZip(fileFrom(zip))).resolves.toEqual({
      kscVersion: '0.45.0',
      rustVersion: '1.90.0',
    });
  });

  it('returns null when the zip has no output ABI', async () => {
    const zip = buildStoredZip('adder/src/lib.rs', 'fn main() {}');
    await expect(readBuildVersionsFromZip(fileFrom(zip))).resolves.toBeNull();
  });

  it('returns null for a non-zip file', async () => {
    const bytes = new TextEncoder().encode('not a zip at all, just text');
    await expect(readBuildVersionsFromZip(fileFrom(bytes))).resolves.toBeNull();
  });
});
