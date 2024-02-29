import { LaunchPadPlus } from '@/assets/icons';
import { useState } from 'react';
import { Body, CardContainer, Head, Title } from './styles';

export const FAQDropdown: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardContainer>
      <Head onClick={() => setIsOpen(!isOpen)}>
        <Title>{title}</Title>
        <LaunchPadPlus />
      </Head>
      <Body isOpen={isOpen}>{description}</Body>
    </CardContainer>
  );
};
