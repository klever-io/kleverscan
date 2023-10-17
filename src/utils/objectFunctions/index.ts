export const deepCopyObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
