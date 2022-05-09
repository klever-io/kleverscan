// to be used for unique keys in the array of objects
export const findKey = (arr: any[], keyName: string): any => {
  const result = arr.find(obj => Object.keys(obj).find(key => key === keyName));
  if (result) {
    return result[keyName];
  }
  return null;
};
