import { PropsWithChildren } from 'react';
import { useTheme } from '@/contexts/theme';
import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { Body, CardContainer, Head, Title } from './styles';

export const FAQDropdown: React.FC<
  PropsWithChildren<{ title: string; description: string }>
> = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkTheme } = useTheme();

  return (
    <CardContainer>
      <Head onClick={() => setIsOpen(!isOpen)}>
        <Title>{title}</Title>
        {isOpen ? (
          <FiMinus color={isDarkTheme ? 'white' : 'black'} size={24} />
        ) : (
          <FiPlus color={isDarkTheme ? 'white' : 'black'} size={24} />
        )}
      </Head>
      <Body isOpen={isOpen}>{description}</Body>
    </CardContainer>
  );
};
