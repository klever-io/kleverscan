/**
 * Converts hexadecimal bytes into human readable string.
 * @param hex
 * @returns string
 */
export const hexToString = (hex: string): string => {
  const stringHex = hex.toString();
  let ret = '';

  for (let i = 0; i < stringHex.length; i += 2) {
    ret += String.fromCharCode(parseInt(stringHex.substr(i, 2), 16));
  }

  return ret;
};

export const setCharAt = (
  str: string,
  index: number,
  newChar: string,
): string => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + newChar + str.substring(index + 1);
};

/**
 * Receives an string as an argument and returns it with it's first character capitalized.
 * @param str
 * @returns string
 */
export const capitalizeString = (str: string): string => {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
};

/**
 * Simply add commas to a number by calling toLocaleString method.
 * @param numb
 * @returns string
 */
export const addCommasToNumber = (numb: number): string => {
  return numb.toLocaleString();
};

/**
 * Emulates CSS ellipsis by receiving a string and a limit, if the string length is bigger then the limit, the exceeded characters will be replaced by the ellipsis.
 * @param text
 * @param limit
 * @returns string
 */
export const breakText = (text: string, limit: number): string => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};
