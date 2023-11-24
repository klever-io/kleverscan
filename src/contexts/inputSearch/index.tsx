import { createContext, useContext, useState } from 'react';

interface ISearch {
  searchValue: string;
  setLinkValue: (trimmedSearch: string, type: string | undefined) => void;
}

export const InputSearchContext = createContext({} as ISearch);

export const InputSearchProvider: React.FC = ({ children }) => {
  const [searchValue, setSearchValue] = useState('');

  const setLinkValue = (trimmedSearch: string, type: string | undefined) => {
    if (!trimmedSearch || !type) {
      setSearchValue('');
    } else {
      setSearchValue(`/${type}/${trimmedSearch}`);
    }
  };

  const values: ISearch = {
    searchValue,
    setLinkValue,
  };

  return (
    <InputSearchContext.Provider value={values}>
      {children}
    </InputSearchContext.Provider>
  );
};

export const useInputSearch = (): ISearch => useContext(InputSearchContext);
