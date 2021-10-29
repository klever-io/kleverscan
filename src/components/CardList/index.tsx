import React from 'react';

import { CardContainer, Container, Subtitle, Title } from './styles';

export interface ICard {
  title: string;
  subtitle: string | number;
  transparent?: boolean;
}

export interface ICardList {
  data: ICard[];
}

const CardList: React.FC<ICardList> = ({ data }) => {
  const Card: React.FC<ICard> = ({
    title,
    subtitle,
    transparent: isTransparent,
  }) => {
    const transparent = isTransparent !== undefined ? isTransparent : true;
    const props = { transparent };

    return (
      <CardContainer {...props}>
        <Title {...props}>{title}</Title>
        <Subtitle {...props}>{subtitle}</Subtitle>
      </CardContainer>
    );
  };

  return (
    <Container>
      {data.map((item, i) => (
        <Card {...item} key={i} />
      ))}
    </Container>
  );
};

export default CardList;
