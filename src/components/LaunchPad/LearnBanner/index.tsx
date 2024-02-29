import Image from 'next/image';
import {
  BannerContainer,
  Button,
  Buttons,
  Content,
  Description,
  RightSide,
  Title,
} from './styles';

export const LearnBanner: React.FC = () => {
  return (
    <BannerContainer>
      <Content>
        <RightSide>
          <Title>
            Learn how to create and apply for funding in just a few steps
          </Title>
          <Description>
            texto para convencimento do usuário a criar um ITO na nossa chain.
            texto para convencimento do usuário a criar um ITO na nossa chain.
            texto para convencimento
          </Description>
          <Buttons>
            <Button>Apply for funding</Button>
            <Button secondary>Create Asset</Button>
          </Buttons>
        </RightSide>
        <Image
          src="/images/dev-pointing-to-screen.jpeg"
          alt="Developer pointing to screen"
          width={550}
          height={350}
        />
      </Content>
    </BannerContainer>
  );
};
