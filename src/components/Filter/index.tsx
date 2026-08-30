import { FilterArrowDown } from '@/assets/icons';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useId,
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
  OpenerButton,
  SelectorContainer,
} from './styles';

export interface IFilterItem {
  item: string;
}

interface ISelectorItemProps {
  id: string;
  value: string;
  label: string;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (value: string) => void;
}

/**
 * One option in the open dropdown. Defined here rather than inside `Filter`:
 * a component built during render gets a fresh identity every time, so the
 * whole option list used to unmount and remount on each keystroke.
 *
 * It reports the value, never the label, so translating what a user reads
 * cannot change what reaches the URL and the API.
 */
const SelectorItem: React.FC<ISelectorItemProps> = ({
  id,
  value,
  label,
  isSelected,
  isActive,
  onSelect,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  // The panel scrolls at 15rem; keep the arrow-key cursor in view. Optional
  // call: jsdom has no scrollIntoView.
  useEffect(() => {
    if (isActive) itemRef.current?.scrollIntoView?.({ block: 'nearest' });
  }, [isActive]);

  return (
    <Item
      ref={itemRef}
      id={id}
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(value)}
      selected={isSelected}
      $active={isActive}
      data-testid="selector-item"
    >
      <p>{label}</p>
    </Item>
  );
};

export interface IFilter {
  title?: string;
  /**
   * Stable identifier for tests, independent of the displayed title. The e2e
   * suite used to reach a filter by its position among its siblings, which
   * broke on any wrapper element or reordering, and would break again once the
   * titles are translated.
   */
  testId?: string;
  firstItem?: string;
  hideAllOption?: boolean;
  inputType?: string;
  overFlow?: string;
  /**
   * The values this filter selects between: selection keys, never displayed
   * text. `onClick` receives one of these, not `renderLabel` output. They are
   * not automatically the wire format either: several callers map them
   * further before anything reaches the URL or the API (the contract filter
   * turns a name into its numeric index, the proposals filter maps
   * "Approved" onto "ApprovedProposal").
   */
  data: string[];
  /**
   * Displayed text for a value. Without it a value shows as itself, which is
   * what every filter did before there was anything to translate. Must be
   * total: it also receives the "All" entry, and it receives whatever a
   * hand-edited URL put in `current`, so return the input unchanged for
   * anything unrecognised rather than throwing or returning undefined.
   */
  renderLabel?: (value: string) => string;
  /** Placeholder for the search box. Defaults to a generic prompt. */
  placeholder?: string;
  /**
   * Shown when a search matches nothing. Passed in rather than built here,
   * because this component has no translator and five of its callers load no
   * namespace at all, so a `t()` in here would render raw keys on their pages.
   */
  notFoundLabel?: string;
  /** Accessible name for the clear button; same no-translator rule as above. */
  clearLabel?: string;
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
  testId,
  data,
  renderLabel,
  placeholder,
  notFoundLabel,
  clearLabel,
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
  // The arrow-key cursor over the option list; -1 is "none". Options are not
  // focusable: focus stays on the input, aria-activedescendant points here.
  const [activeIndex, setActiveIndex] = useState(-1);

  const baseId = useId();
  const labelId = title ? `${baseId}-label` : undefined;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  // Keep display in sync when parent changes `current` (e.g. URL / external chips).
  useEffect(() => {
    setSelected(initial || allItem);
  }, [initial, allItem]);

  const contentRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

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
    setActiveIndex(-1);
  }, []);

  const getDataArray = useCallback(
    () => (hideAllOption ? data : [allItem].concat(data)),
    [hideAllOption, data, allItem],
  );

  const open = useCallback(() => {
    setClosed(false);
    // Start the arrow-key cursor on the current value, as a native select does.
    setActiveIndex(getDataArray().indexOf(selected));
  }, [getDataArray, selected]);

  const openDropdown = useCallback(() => {
    if (disabledInput) return;
    if (closed) {
      open();
      return;
    }
    // Non-typeahead mode: second click on the control closes.
    if (!isHiddenInput) {
      closeDropDown();
    }
  }, [closed, closeDropDown, disabledInput, isHiddenInput, open]);

  const arrowOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabledInput) return;
    if (!closed) {
      closeDropDown();
    } else {
      open();
    }
  };

  /**
   * The single place a value becomes text on screen. Everything else in this
   * component works in values, so what a user reads and what the URL carries
   * can never drift apart.
   */
  const labelOf = useCallback(
    (value: string): string => (renderLabel ? renderLabel(value) : value),
    [renderLabel],
  );

  const handleSelect = useCallback(
    (value: string) => {
      if (onClick) {
        onClick(value);
      }
      setSelected(value);
      closeDropDown();
      // The input the focus was on unmounts with the panel; land it back on
      // the opener so keyboard users are not dropped to <body>.
      openerRef.current?.focus({ preventScroll: true });
    },
    [onClick, closeDropDown],
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelected(allItem);
    if (onClick) {
      onClick(allItem);
    }
    // Same order as handleSelect: close first, then land focus on the opener.
    // Clearing empties the button under the keyboard user's focus (the
    // `empty` style is display:none), and without the close an open panel
    // stayed stranded behind an opener whose activation is a no-op.
    closeDropDown();
    openerRef.current?.focus({ preventScroll: true });
  };

  const handleChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    // Kept verbatim. It used to be stripped to `[\w.\-\s]`, which silently
    // truncated at the first accented character and so made any non-ASCII
    // label unsearchable. Nothing needs the sanitising: the match below is a
    // literal `includes`, never a RegExp, so the input cannot be a pattern.
    setInputValue(value);
    setActiveIndex(-1);
    if (onChange) {
      onChange(value);
    }
  };

  const filterArrayByInput = (input: string) => {
    if (input === '') {
      return getDataArray();
    }
    // Literal case-insensitive match — do not pass user input to RegExp
    // (dots in versions like v1.7.20 must not mean "any character").
    const needle = input.toLowerCase();
    // Matched against what the user reads first, because that is what they
    // type. The raw value stays searchable too, so a link or a habit built on
    // the wire spelling keeps working.
    // Both sides go through String() because `data: string[]` is not enforced
    // at runtime: any caller building its list from optional API fields can
    // hand this a hole, and one did before it started filtering at the
    // source. The value side always had this guard; without it on the label
    // side a keystroke throws mid-render, and there is no error boundary.
    return getDataArray().filter(value => {
      const haystack = String(value).toLowerCase();
      const label = String(labelOf(value)).toLowerCase();
      return label.includes(needle) || haystack.includes(needle);
    });
  };
  const filteredArray = filterArrayByInput(inputValue);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const length = filteredArray.length;
      if (!length) return;
      const goingDown = event.key === 'ArrowDown';
      setActiveIndex(previous => {
        // The cursor may have been seeded against the unfiltered list; treat
        // an out-of-range value as "none" so the walk starts at an edge.
        const inRange = previous >= 0 && previous < length;
        if (goingDown) {
          return ((inRange ? previous : -1) + 1) % length;
        }
        return ((inRange ? previous : 0) - 1 + length) % length;
      });
      return;
    }
    if (event.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < filteredArray.length) {
        event.preventDefault();
        handleSelect(filteredArray[activeIndex]);
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      // Only this dropdown: a page dialog listening for Escape must not close.
      event.stopPropagation();
      closeDropDown();
      openerRef.current?.focus({ preventScroll: true });
    }
  };

  // On Content rather than on the input: React's onBlur is the bubbling
  // focusout, so this sees EVERY hop out of the widget. On the input alone,
  // Tab parked on the opener first ("inside", no close) and the next Tab
  // left from the opener with no handler, orphaning the panel open.
  const handleContentBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (closed) return;
    if (dontBlur) return;
    // Focus moving to the clear button or an option is not "leaving".
    const next = event.relatedTarget as Node | null;
    if (next && contentRef.current?.contains(next)) return;
    closeDropDown();
  };

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
    onClick: () => closeDropDown(),
  };
  // The specific prompts used to be picked by comparing `title` against five
  // English literals. That already failed silently on the assets and pools
  // pages, whose title reads "Assets" while the branch tested for "Asset", and
  // it would fail everywhere the moment titles are translated. Call sites now
  // say what they want.
  const searchPlaceholder = placeholder ?? 'Type to search…';

  return (
    <Container
      maxWidth={maxWidth}
      open={!closed}
      data-testid={testId ? `filter-${testId}` : undefined}
    >
      <span id={labelId}>{title}</span>
      <Content
        onMouseEnter={() => setDontBlur(true)}
        onMouseLeave={() => setDontBlur(false)}
        onBlur={handleContentBlur}
        data-testid="selector"
        {...contentProps}
      >
        {!closed && (
          <HiddenInput
            onKeyDown={handleInputKeyDown}
            value={inputValue}
            type={inputType}
            ref={focusRef}
            show={!closed}
            placeholder={searchPlaceholder}
            onChange={handleChange}
            isHiddenInput={isHiddenInput}
            aria-label={title ? `Search ${title}` : 'Search filter'}
            role="combobox"
            aria-expanded={!closed}
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex >= 0 && activeIndex < filteredArray.length
                ? optionId(activeIndex)
                : undefined
            }
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
        )}
        <OpenerButton
          ref={openerRef}
          type="button"
          // Out of the Tab order while open: focus lives on the search input
          // then, and this button is a dead stop with a collapsed name. The
          // Escape/select focus return uses .focus(), which -1 still allows.
          tabIndex={closed ? undefined : -1}
          aria-haspopup="listbox"
          aria-expanded={!closed}
          aria-controls={!closed ? listboxId : undefined}
          aria-labelledby={labelId ? `${labelId} ${baseId}-value` : undefined}
          aria-disabled={disabledInput || undefined}
          onClick={event => {
            // Content also opens on click; the second call in the same batch
            // happens to be idempotent only because it reads a stale `closed`.
            // Stopping here keeps the toggle off that batching subtlety.
            event.stopPropagation();
            openDropdown();
          }}
        >
          <span
            id={`${baseId}-value`}
            style={{ overflow: overFlow ?? 'hidden' }}
          >
            {closed && selected ? labelOf(selected) : ''}
          </span>
        </OpenerButton>

        {!hideAllOption && (
          <CloseContainer
            type="button"
            aria-label={
              clearLabel ?? (title ? `Clear ${title} filter` : 'Clear filter')
            }
            empty={selected === allItem}
            onClick={handleClear}
          >
            <AiOutlineClose />
          </CloseContainer>
        )}

        <ArrowDownContainer
          onClick={arrowOnClick}
          open={!closed}
          aria-hidden="true"
        >
          <FilterArrowDown />
        </ArrowDownContainer>
        {!closed && (
          <SelectorContainer
            {...selectorProps}
            role="listbox"
            id={listboxId}
            aria-labelledby={labelId}
            // Chromium makes a scrollable box without focusable children a
            // Tab stop; in an activedescendant pattern the list must not be.
            tabIndex={-1}
          >
            {!filteredArray.length && !loading ? (
              <span>{notFoundLabel ?? `${title} not found!`}</span>
            ) : (
              filteredArray.map((value, index) => (
                <SelectorItem
                  // Values are not guaranteed unique: the validators filter
                  // lists on-chain names, which nothing dedupes.
                  key={`${index}-${value}`}
                  id={optionId(index)}
                  value={value}
                  label={labelOf(value)}
                  isSelected={value === selected}
                  isActive={index === activeIndex}
                  onSelect={handleSelect}
                />
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
