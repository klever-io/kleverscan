import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Container, ErrorContainer } from './styles';

import Button from '../Button';

import { FiSearch } from 'react-icons/fi';
export interface IInput {
  mainPage?: boolean;
}

interface KeyboardEvent {
  key: string;
}

const Input: React.FC<IInput> = ({ mainPage }) => {
  const router = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const isMainPage: boolean = mainPage === undefined ? false : mainPage;
  const placeholderText = 'Search Address, Block, Transfer';
  const errorText = 'Invalid Address, Block, Transfer.';

  useEffect(() => {
    const enterHandle = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };

    window.addEventListener('keypress', enterHandle);

    return () => {
      window.removeEventListener('keypress', enterHandle);
    };
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setInputValue(event.target.value);
  };

  const validationInput = (value: string) => {
    const addressLength = 62;
    const txLength = 64;

    if (!isNaN(Number(value)) && Number(value) !== 0) {
      return 'blocks';
    }

    if (value.length === txLength) {
      return 'transactions';
    }

    if (value.length === addressLength) {
      return 'accounts';
    }

    return 'assets';
  };

  const handleSearch = () => {
    const type = validationInput(inputValue);

    if (inputValue === '' || !inputValue || !type) {
      setError(true);
      return;
    }

    router.push(`/${type}/${inputValue}`);
  };

  return (
    <>
      <Container mainPage={isMainPage}>
        <div>
          <FiSearch />
          <input placeholder={placeholderText} onChange={handleInput} />
        </div>
        <Button mainPage onClick={handleSearch}>
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
