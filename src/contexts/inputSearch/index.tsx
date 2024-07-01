import { PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';

interface ISearch {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const InputSearchContext = createContext({} as ISearch);

export const InputSearchProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const values: ISearch = {
    searchValue,
    setSearchValue,
  };

  return (
    <InputSearchContext.Provider value={values}>
      {children}
    </InputSearchContext.Provider>
  );
};

export const useInputSearch = (): ISearch => useContext(InputSearchContext);
