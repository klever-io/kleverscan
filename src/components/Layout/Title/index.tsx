import { useRouter } from 'next/router';
import { Container, StyledArrow } from './styles';

interface ITitle {
  title?: string;
  Icon?: React.FC;
  route?: string;
  Component?: React.FC;
}

const Title: React.FC<ITitle> = ({ title, Icon, route, Component }) => {
  const router = useRouter();
  return (
    <Container>
      <div onClick={() => router.push(route ? route : '/')}>
        <StyledArrow />
      </div>

      {title && <h1>{title}</h1>}
      {Component && <Component />}
      {Icon && <Icon />}
    </Container>
  );
};

export default Title;
