import React, { useState, KeyboardEvent, useRef } from 'react';

import { useRouter } from 'next/router';

import { Search } from '@/assets/icons';

import { Container } from './styles';

interface IInput {
  className?: string;
}

const Input: React.FC<IInput> = ({ className }) => {
  const [search, setSearch] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<any>(null);

  const router = useRouter();

  const placeholder = 'Search Address, Block, Transfer';

  const getInputType = (value: string) => {
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

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setSearch(event.target.value);
  };

  const handleSearch = () => {
    const type = getInputType(search);

    if (search === '' || !search || !type) {
      setError(true);
      return;
    }

    router.push(`/${type}/${search}`);
  };

  const keyDownHandle = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleContainer = () => {
    inputRef.current?.focus();
  };

  const containerProps = {
    className,
    onClick: handleContainer,
  };

  const inputProps = {
    ref: inputRef,
    placeholder,
    onChange: handleInput,
    onKeyDown: keyDownHandle,
  };

  return (
    <Container {...containerProps}>
      <input {...inputProps} />
      <Search onClick={handleSearch} />
    </Container>
  );
};

export default Input;
