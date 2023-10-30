import { Search } from '@/assets/icons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import PrePageTooltip from '../PrePageTooltip';
import { Container, FocusBackground } from './styles';

interface InputGlobal {
  className?: string;
  setOpenSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  openSearch?: boolean;
}

const Input: React.FC<InputGlobal> = ({
  className,
  setOpenSearch,
  openSearch,
}) => {
  const [search, setSearch] = useState('');
  const [error, setError] = useState(false);
  const [linkPage, setLinkPage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');

  const placeholder = t('Search Address, Block, Transaction, Asset');

  const router = useRouter();

  useEffect(() => {
    function handleScroll() {
      setShowTooltip(false);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (openSearch) {
      handleContainer();
    }
  }, [openSearch]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }
    setShowTooltip(true);
    setSearch(event.target.value.trim().toLowerCase());
  };

  const handleSearch = (value: string) => {
    setLinkPage(value);
  };

  const keyDownHandle = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (linkPage !== '') router.push(linkPage);
    }
  };

  const handleContainer = () => {
    inputRef.current?.focus();
  };

  const handleTooltipFocus = (e: any) => {
    if (!(e.target.id === 'PrePageTooltip' || e.target.id === 'SearchIcon')) {
      // if (inputRef.current !== null) inputRef.current.value = '';
      setShowTooltip(false);
    }
  };

  const handleClick = () => {
    setShowTooltip(true);
  };

  const containerProps = {
    isInHomePage: router.pathname === '/',
    className,
    onClick: handleContainer,
  };

  const inputProps = {
    ref: inputRef,
    placeholder,
    onChange: handleInput,
    onKeyDown: keyDownHandle,
    setOpenSearch: setOpenSearch,
    onClick: handleClick,
  };

  return (
    <>
      <Container {...containerProps}>
        <input {...inputProps} />
        <Search onClick={handleSearch} id={'SearchIcon'} />
        {showTooltip && (
          <>
            <FocusBackground
              onClick={handleTooltipFocus}
              id="FocusBackground"
            />
            <PrePageTooltip
              handleSearch={handleSearch}
              search={search}
              setShowTooltip={setShowTooltip}
              isInHomePage={containerProps.isInHomePage}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default Input;
