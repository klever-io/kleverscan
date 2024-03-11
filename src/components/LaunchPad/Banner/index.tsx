import {
  BannerContainer,
  Button,
  Buttons,
  Content,
  Description,
  Title,
} from './styles';

export const LaunchPadBanner: React.FC = () => {
  return (
    <BannerContainer>
      <Content>
        <Title>
          Initial Token Offering (ITO) <strong>Simplified</strong>
        </Title>
        <Description>
          Raise money for your blockchain project by selling tokens in an
          Initial Token Offering (ITO). Give buyers special accesss or services
          in the project, offering real value to investors and users.
        </Description>
        <Buttons>
          <Button>Have a project? Apply here</Button>
          <Button secondary>Don’t have a project yet? Start here</Button>
        </Buttons>
      </Content>
    </BannerContainer>
  );
};
