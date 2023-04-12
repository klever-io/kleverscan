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
): Promise<boolean> => {
  if (regexImgUrl(url)) {
    return true;
  }

  if (await validateImgRequestHeader(url, timeout)) {
    return true;
  }

  if (await isImage(url, timeout)) {
    return true;
  }
  return false;
};
