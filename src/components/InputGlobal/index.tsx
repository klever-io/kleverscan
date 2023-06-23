import { Search } from '@/assets/icons';
import { useTranslation } from 'next-i18next';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import PrePageTooltip from '../PrePageTooltip';
import { Container, FocusBackground, SearchWrapper } from './styles';

interface InputGlobal {
  className?: string;
}

const Input: React.FC<InputGlobal> = ({ className }) => {
  const [search, setSearch] = useState('');
  const [error, setError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');

  const placeholder = t('Search Address, Block, Transaction');

  useEffect(() => {
    function handleScroll() {
      setShowTooltip(false);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }
    if (showTooltip) {
      setShowTooltip(false);
    }
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    setShowTooltip(true);
  };

  const keyDownHandle = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleContainer = () => {
    inputRef.current?.focus();
  };

  const handleTooltipFocus = (e: any) => {
    if (!(e.target.id === 'PrePageTooltip' || e.target.id === 'SearchIcon')) {
      if (inputRef.current !== null) inputRef.current.value = '';
      setShowTooltip(false);
    }
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
    <SearchWrapper>
      <Container {...containerProps}>
        <input {...inputProps} />
        <Search onClick={handleSearch} id={'SearchIcon'} />
      </Container>
      {showTooltip && (
        <>
          <FocusBackground onClick={handleTooltipFocus} id="FocusBackground" />
          <PrePageTooltip search={search} setShowTooltip={setShowTooltip} />
        </>
      )}
    </SearchWrapper>
  );
};

export default Input;
