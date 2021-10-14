import React, { useState, KeyboardEvent } from 'react';

import { useRouter } from 'next/router';

import { Container, ErrorContainer } from './styles';

import Button from '../Button';

import { FiSearch } from 'react-icons/fi';
export interface IInput {
  mainPage?: boolean;
}

const Input: React.FC<IInput> = ({ mainPage }) => {
  const router = useRouter();

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

  const keyDownHandle = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <Container mainPage={isMainPage}>
        <div>
          <FiSearch />
          <input
            placeholder={placeholderText}
            onChange={handleInput}
            onKeyDown={keyDownHandle}
          />
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
