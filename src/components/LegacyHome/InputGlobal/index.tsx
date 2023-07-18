import { Search } from '@/assets/icons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { KeyboardEvent, useRef, useState } from 'react';
import { Container } from './styles';

interface InputGlobal {
  className?: string;
}

const Input: React.FC<InputGlobal> = ({ className }) => {
  const [search, setSearch] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');

  const router = useRouter();

  const placeholder = t('Search Address, Block, Transaction');

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

    if (
      type === 'asset' &&
      (treatedSearch.toUpperCase() === 'KFI' ||
        treatedSearch.toUpperCase() === 'KLV' ||
        treatedSearch.length === 8)
    ) {
      router.push(`/${type}/${treatedSearch}`);
      if (inputRef.current !== null) inputRef.current.value = '';
      return;
    }

    if (
      type === 'asset' &&
      treatedSearch.length >= 3 &&
      treatedSearch.length < 9
    ) {
      if (inputRef.current !== null) inputRef.current.value = '';
      router
        .push({
          pathname: '/assets',
          query: `asset=${treatedSearch.toUpperCase()}`,
        })
        .then(() => {
          if (router.pathname === '/assets') router.reload();
        });
      return;
    }
    router.push(`/${type}/${treatedSearch}`);
    if (inputRef.current !== null) inputRef.current.value = '';
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
