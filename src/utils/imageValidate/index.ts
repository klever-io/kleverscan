import { regexImgUrl } from '../formatFunctions';

/**
 * Checks if an URL can be used as an html image src. Must pass a timeout arg for this check.
 * @param url
 * @param timeout
 * @returns although TS says unknown, it should return Promise < boolean >
 */
export const isImage = async (
  url: string,
  timeout: number,
): Promise<unknown> => {
  const imgPromise = new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => resolve(false), timeout);
  });

  return Promise.race([imgPromise, timeoutPromise]);
};

/**
 * Check if the header 'content-type' of a specified URL is of type 'image'. Must pass a timeout arg for this check.
 * @param url
 * @param timeout
 * @returns Promise < boolean >
 */
export const validateImgRequestHeader = async (
  url: string,
  timeout: number,
): Promise<boolean> => {
  try {
    const fetchHeaders = fetch(url, { method: 'HEAD' });
    const timeoutPromise = new Promise(resolve => {
      setTimeout(() => resolve(false), timeout);
    });
    const headers: any = await Promise.race([fetchHeaders, timeoutPromise]);
    if (
      typeof headers === 'object' &&
      headers?.headers?.get('content-type').startsWith('image')
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Compiles all URL image validators functions and use it as the definitive URL image validator function.
 * @param url
 * @param timeout
 * @returns Promise < boolean >
 */
export const validateImgUrl = async (
  url: string,
  timeout: number,
): Promise<[boolean, string?]> => {
  if (regexImgUrl(url)) {
    const imageLoadResult = await isImage(url, timeout);
    if (imageLoadResult) {
      return [true];
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'no-cors',
    });
    clearTimeout(timeoutId);

    if (response.type === 'opaque') {
      const imageLoadResult = await isImage(url, timeout);
      if (imageLoadResult) {
        return [true];
      }
    }
  } catch (error) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return [false, 'Failed to fetch image'];
      }

      const blob = await response.blob();
      const sizeInKB = blob.size / 1024;
      let width = 0;
      let height = 0;

      if (sizeInKB > 1024 * 3) {
        return [false, 'maximum image size should be 3mb'];
      }

      const img = new Image();
      img.src = URL.createObjectURL(blob);

      const imgLoaded = new Promise<[number, number]>((resolve, reject) => {
        const loadTimeout = setTimeout(() => {
          reject(new Error('Image load timeout'));
        }, timeout);

        img.onload = () => {
          clearTimeout(loadTimeout);
          width = img.width;
          height = img.height;
          resolve([width, height]);
        };

        img.onerror = () => {
          clearTimeout(loadTimeout);
          reject(new Error('Failed to load image'));
        };
      });

      [width, height] = await imgLoaded;

      if (width > 1920 || height > 1080) {
        return [false, 'maximum image size should be 1920x1080'];
      }

      URL.revokeObjectURL(img.src);

      return [true];
    } catch (corsError) {
      if (corsError instanceof Error && corsError.name === 'AbortError') {
        return [false, 'Request timeout'];
      }

      const imageLoadResult = await isImage(url, timeout);
      if (imageLoadResult) {
        return [true];
      }

      const headerResult = await validateImgRequestHeader(url, timeout);
      if (headerResult) {
        return [true];
      }

      return [false, 'Unable to validate image due to CORS restrictions'];
    }
  }

  return [false, 'Image validation failed'];
};
