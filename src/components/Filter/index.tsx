import { FilterArrowDown } from '@/assets/icons';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Loader } from '../Loader/styles';
import {
  ArrowDownContainer,
  CloseContainer,
  Container,
  Content,
  HiddenInput,
  Item,
  LoadContainer,
  SelectorContainer,
} from './styles';

export interface IFilterItem {
  item: string;
}

export interface IFilter {
  title?: string;
  firstItem?: string;
  hideAllOption?: boolean;
  inputType?: string;
  overFlow?: string;
  data: string[];
  onClick?(selected: string): void;
  onChange?(value: string): void;
  current: string | undefined;
  loading?: boolean;
  disabledInput?: boolean;
  isHiddenInput?: boolean;
  maxWidth?: boolean;
}

const Filter: React.FC<PropsWithChildren<IFilter>> = ({
  title,
  data,
  onClick,
  onChange,
  current: initial,
  firstItem,
  hideAllOption = false,
  overFlow,
  inputType = 'text',
  loading,
  disabledInput,
  isHiddenInput = true,
  maxWidth,
}) => {
  const allItem = firstItem || 'All';
  const [selected, setSelected] = useState(initial || allItem);
  const [closed, setClosed] = useState(true);
  const [dontBlur, setDontBlur] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Keep display in sync when parent changes `current` (e.g. URL / external chips).
  useEffect(() => {
    setSelected(initial || allItem);
  }, [initial, allItem]);

  const contentRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLInputElement>(null);

  // Input only mounts after open; focus once it exists so the caret is visible.
  useEffect(() => {
    if (closed || disabledInput) return;

    const focusInput = () => {
      const el = focusRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      // Move caret to end so typing feels ready.
      const len = el.value.length;
      try {
        el.setSelectionRange(len, len);
      } catch {
        // Some input types (e.g. button) do not support selection APIs.
      }
    };

    // Double rAF: wait for the input to paint after `closed` flips.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(focusInput);
    });
    return () => cancelAnimationFrame(id);
  }, [closed, disabledInput]);

  const closeDropDown = useCallback(() => {
    setClosed(true);
    setInputValue('');
  }, []);

  const openDropdown = useCallback(() => {
    if (disabledInput) return;
    if (closed) {
      setClosed(false);
      return;
    }
    // Non-typeahead mode: second click on the control closes.
    if (!isHiddenInput) {
      closeDropDown();
    }
  }, [closed, closeDropDown, disabledInput, isHiddenInput]);

  const arrowOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabledInput) return;
    if (!closed) {
      closeDropDown();
    } else {
      setClosed(false);
    }
  };

  const SelectorItem: React.FC<PropsWithChildren<IFilterItem>> = ({ item }) => {
    const handleClick = () => {
      if (onClick) {
        onClick(item);
      }
      setSelected(item);
      closeDropDown();
    };
    return (
      <Item
        onClick={handleClick}
        selected={item === selected}
        data-testid="selector-item"
      >
        <p>{item}</p>
      </Item>
    );
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelected(allItem);
    if (onClick) {
      onClick(allItem);
    }
  };

  const handleChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    if (value === '') {
      setInputValue('');
    } else {
      // Allow dots for versions (v1.7.20) and common name chars.
      const parsedValue = value.match(/[\w.\-\s]+/gi)?.[0];
      if (parsedValue) {
        setInputValue(parsedValue);
      }
    }
    if (onChange) {
      onChange(value);
    }
  };
  const getDataArray = () => (hideAllOption ? data : [allItem].concat(data));

  const filterArrayByInput = (input: string) => {
    if (input === '') {
      return getDataArray();
    }
    // Literal case-insensitive match — do not pass user input to RegExp
    // (dots in versions like v1.7.20 must not mean "any character").
    const needle = input.toLowerCase();
    return getDataArray().filter(item =>
      String(item).toLowerCase().includes(needle),
    );
  };
  const filteredArray = filterArrayByInput(inputValue);

  const contentProps = useMemo(() => {
    return {
      ref: contentRef,
      open: closed,
      onClick: () => openDropdown(),
    };
  }, [closed, openDropdown]);

  const selectorProps = {
    ref: selectorRef,
    open: closed,
    overFlow,
    onClick: () => closeDropDown(),
  };
  const getPlaceholder = () => {
    if (title === 'Coin' || title === 'Asset') {
      return 'Type the token ID';
    }
    if (title === 'Contract') {
      return 'Type the contract';
    }
    if (title === 'Name') {
      return 'Search name…';
    }
    if (title === 'Version') {
      return 'Search version…';
    }
    return 'Type to search…';
  };

  return (
    <Container maxWidth={maxWidth} open={!closed}>
      <span>{title}</span>
      <Content
        onMouseEnter={() => setDontBlur(true)}
        onMouseLeave={() => setDontBlur(false)}
        data-testid="selector"
        {...contentProps}
      >
        {!closed && (
          <HiddenInput
            onBlur={() => !dontBlur && closeDropDown()}
            value={inputValue}
            type={title !== 'Status' ? inputType : 'button'}
            ref={focusRef}
            show={!closed}
            placeholder={getPlaceholder()}
            onChange={handleChange}
            isHiddenInput={isHiddenInput}
            aria-label={title ? `Search ${title}` : 'Search filter'}
            autoComplete="off"
            spellCheck={false}
          />
        )}
        <span style={{ overflow: overFlow ? overFlow : 'hidden' }}>
          {closed && selected ? selected : ''}
        </span>

        {!hideAllOption && (
          <CloseContainer empty={selected === allItem} onClick={handleClear}>
            <AiOutlineClose />
          </CloseContainer>
        )}

        <ArrowDownContainer onClick={arrowOnClick} open={!closed}>
          <FilterArrowDown />
        </ArrowDownContainer>
        {!closed && (
          <SelectorContainer {...selectorProps}>
            {!filteredArray.length && !loading ? (
              <span>{title} not found!</span>
            ) : (
              filteredArray.map((item, index) => (
                <SelectorItem key={String(index)} item={item} />
              ))
            )}
            {loading && (
              <LoadContainer>
                <Loader />
              </LoadContainer>
            )}
          </SelectorContainer>
        )}
      </Content>
    </Container>
  );
};

export default Filter;
