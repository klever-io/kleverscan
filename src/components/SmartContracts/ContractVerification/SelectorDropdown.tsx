import React, { useEffect, useRef, useState } from 'react';
import {
  DropdownContainer,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from './styles';

export interface ISelectorDropdownOption<T extends string | number> {
  label: string;
  value: T;
}

interface ISelectorDropdownProps<T extends string | number> {
  value: T;
  options: ISelectorDropdownOption<T>[];
  onChange: (value: T) => void;
  align?: 'left' | 'right';
}

function SelectorDropdown<T extends string | number>({
  value,
  options,
  onChange,
  align = 'left',
}: ISelectorDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownTrigger
        type="button"
        onClick={() => setIsOpen(open => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption?.label ?? value}
      </DropdownTrigger>
      <DropdownMenu active={isOpen} align={align}>
        {options.map(option => (
          <DropdownItem
            key={String(option.value)}
            type="button"
            selected={option.value === value}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}

export default SelectorDropdown;
