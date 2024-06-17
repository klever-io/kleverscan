import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { Container, IconContainer, StyledArrow } from './styles';

interface ITitle {
  title?: string;
  Icon?: React.FC<PropsWithChildren>;
  route?: string | -1;
  Component?: React.FC<PropsWithChildren>;
  isAccountOwner?: boolean;
}

const Title: React.FC<PropsWithChildren<ITitle>> = ({
  title,
  Icon,
  route,
  Component,
  isAccountOwner,
}) => {
  const router = useRouter();
  return (
    <Container>
      <IconContainer
        onClick={() => {
          if (route === -1) {
            router.back();
          } else {
            router.push(route ? route : '/');
          }
        }}
      >
        <StyledArrow />
      </IconContainer>
      {Icon && isAccountOwner && <Icon />}
      {title && <h1>{title}</h1>}
      {Component && <Component />}
      {Icon && !isAccountOwner && <Icon />}
    </Container>
  );
};

export default Title;
