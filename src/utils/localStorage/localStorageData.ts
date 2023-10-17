export const storageUpdateBlocks = (bool: boolean): boolean => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('updateBlocks', String(!bool));
    return !bool;
  }
  return !bool;
};

export const getStorageUpdateConfig = (): boolean => {
  if (typeof window !== 'undefined') {
    const storageConfig = localStorage.getItem('updateBlocks');
    if (storageConfig) {
      return JSON.parse(storageConfig);
    } else {
      localStorage.setItem('updateBlocks', 'false');
      return false;
    }
  }
  return false;
};
