import { useRouter } from 'next/router';
import { Container, StyledArrow } from './styles';

interface ITitle {
  title?: string;
  Icon?: React.FC;
  route?: string;
  Component?: React.FC;
  isAccountOwner?: boolean;
}

const Title: React.FC<ITitle> = ({
  title,
  Icon,
  route,
  Component,
  isAccountOwner,
}) => {
  const router = useRouter();
  return (
    <Container>
      <div onClick={() => router.push(route ? route : '/')}>
        <StyledArrow />
      </div>
      {Icon && isAccountOwner && <Icon />}
      {title && <h1>{title}</h1>}
      {Component && <Component />}
      {Icon && !isAccountOwner && <Icon />}
    </Container>
  );
};

export default Title;
