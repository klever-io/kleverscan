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
        <Title>A new era of crowdfund is starting now</Title>
        <Description>
          Start collecting funds and change the future of your project with our
          comunity
        </Description>
        <Buttons>
          <Button>Apply for funding</Button>
          <Button secondary>Create Asset</Button>
        </Buttons>
      </Content>
    </BannerContainer>
  );
};
