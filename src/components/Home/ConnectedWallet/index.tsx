import { useExtension } from '@/contexts/extension';
import { parseAddress } from '@/utils/parseValues';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  BoxSelect,
  CircleConnected,
  Container,
  ContainerItems,
  ContainerWallet,
  ItemsSelect,
} from './styles';

export const ConnectedWallet: React.FC = () => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [options, setOptions] = useState([
    { value: true, label: 'MainNet' },
    { value: false, label: 'TestNet' },
    { value: false, label: 'DevNet' },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { walletAddress } = useExtension();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleClick = () => {
    setOptionsOpen(!optionsOpen);
  };

  const handleClickItems = (option: string) => {
    setOptions(prevOptions => {
      const updatedOptions = prevOptions.map(item => {
        if (item.label === option) {
          return { ...item, value: !item.value };
        } else {
          return { ...item, value: false };
        }
      });

      return updatedOptions;
    });
    setOptionsOpen(false);
  };

  return (
    <Container ref={containerRef}>
      <ContainerWallet>
        <p>Connected Wallet</p>
        <small>{walletAddress && parseAddress(walletAddress, 15)}</small>
        <CircleConnected />
      </ContainerWallet>
      <ContainerItems>
        <BoxSelect>
          <div onClick={handleClick}>
            {options.map(option => {
              if (option.value === false) {
                return <></>;
              }
              return (
                <div key={option.label}>
                  <p>{option.label}</p>
                </div>
              );
            })}
            <ArrowDown isOpen={optionsOpen} />
          </div>
          <ItemsSelect isOpen={optionsOpen}>
            {options.map((option, key) => {
              if (option.value === true) {
                return <></>;
              }
              return (
                <p key={key} onClick={() => handleClickItems(option.label)}>
                  {option.label}
                </p>
              );
            })}
          </ItemsSelect>
        </BoxSelect>
      </ContainerItems>
    </Container>
  );
};
