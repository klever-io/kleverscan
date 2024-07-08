import { PropsWithChildren } from 'react';
import { Search } from '@/assets/icons';
import { useInputSearch } from '@/contexts/inputSearch';
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

const Input: React.FC<PropsWithChildren<InputGlobal>> = ({
  className,
  setOpenSearch,
  openSearch,
}) => {
  const [search, setSearch] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<NodeJS.Timeout>();
  const { searchValue } = useInputSearch();
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

  const debounce = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setSearch(event.target.value);
    }, 1000);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTooltip(true);
    debounce(event);
  };

  const handleSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.type === 'click') {
      event.preventDefault();
      if (searchValue !== '') router.push(searchValue);
    }
  };

  const handleContainer = () => {
    inputRef.current?.focus();
  };

  const handleTooltipFocus = (e: any) => {
    if (!(e.target.id === 'PrePageTooltip' || e.target.id === 'SearchIcon')) {
      setShowTooltip(false);
    }
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
    onKeyDown: handleSearch,
  };

  return (
    <Container {...containerProps}>
      <input {...inputProps} data-testid="search" />
      <Search onClick={handleSearch} id={'SearchIcon'} />
      {showTooltip && (
        <>
          <FocusBackground onClick={handleTooltipFocus} id="FocusBackground" />
          <PrePageTooltip
            search={search}
            setShowTooltip={setShowTooltip}
            isInHomePage={containerProps.isInHomePage}
          />
        </>
      )}
    </Container>
  );
};

export default Input;
