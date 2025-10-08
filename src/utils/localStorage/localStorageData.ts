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

export const storageViewMode = (viewMode: 'table' | 'grid'): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('viewMode', viewMode);
  }
};

export const getStorageViewMode = (): 'table' | 'grid' => {
  if (typeof window !== 'undefined') {
    const storageViewMode = localStorage.getItem('viewMode');
    if (storageViewMode === 'table' || storageViewMode === 'grid') {
      return storageViewMode;
    } else {
      localStorage.setItem('viewMode', 'table');
      return 'table';
    }
  }
  return 'table';
};
