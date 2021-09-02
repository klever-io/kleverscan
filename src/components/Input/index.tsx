import React from 'react';

import { Container, ErrorContainer } from './styles';

import { FiSearch } from 'react-icons/fi';
import Button from '../Button';
import { useState } from 'react';

export interface IInput {
  mainPage?: boolean;
}

const Input: React.FC<IInput> = ({ mainPage }) => {
  const [error, setError] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const isMainPage: boolean = mainPage === undefined ? false : mainPage;
  const placeholderText = 'Search Address, Block, Transfer';
  const errorText = 'Invalid Address, Block, Transfer.';

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    if (inputValue === '' || !inputValue) {
      setError(true);
      return;
    }
  };

  return (
    <>
      <Container mainPage={isMainPage}>
        <>
          <FiSearch />
          <input placeholder={placeholderText} onChange={handleInput} />
        </>
        <Button mainPage={isMainPage} onClick={handleSearch}>
          Search
        </Button>
      </Container>
      <ErrorContainer error={error}>
        <span>{errorText}</span>
      </ErrorContainer>
    </>
  );
};

export default Input;
