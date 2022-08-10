import { Search } from '@/assets/icons';
import { useRouter } from 'next/router';
import React, { KeyboardEvent, useRef, useState } from 'react';
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
      return 'block';
    }

    if (value.length === txLength) {
      return 'transaction';
    }

    if (value.length === addressLength) {
      return 'account';
    }

    return 'asset';
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setSearch(event.target.value);
  };

  const handleSearch = () => {
    const treatedSearch = search.trim();

    const type = getInputType(treatedSearch);

    if (treatedSearch === '' || !treatedSearch || !type) {
      setError(true);
      return;
    }

    router.push(`/${type}/${treatedSearch}`);
    inputRef.current.value = '';
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
