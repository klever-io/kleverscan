import { PropsWithChildren } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { Button } from '../Banner/styles';
import {
  BannerContainer,
  Buttons,
  Content,
  Description,
  Label,
  LeftSide,
  RightSide,
  Title,
} from './styles';

export const LearnBanner: React.FC<PropsWithChildren> = () => {
  return (
    <BannerContainer>
      <Content>
        <LeftSide>
          <Label>Launch your project</Label>
          <Title>
            Join the KleverChain revolution and unlock your project&apos;s full
            potential with a seamless, secure, and scalable ITO experience.
          </Title>
          <Description>
            Seamless User Experience for you and your investors.
            <br />
            Robust Security with cutting-edge blockchain technology.
            <br />
            Scalability and Flexibility to grow with your project.
            <br />
            Vibrant Community dedicated to your success.
            <br />
            <br />
            Join KleverChain and empower your ITO today!
          </Description>
          <Buttons>
            <Link
              href="/create-transaction?contract=ConfigITOContract"
              legacyBehavior
            >
              <Button href="/create-transaction?contract=ConfigITOContract">
                Configure your ITO
              </Button>
            </Link>
            <Link
              href="/create-transaction?contract=CreateAssetContract"
              legacyBehavior
            >
              <Button
                secondary
                href="/create-transaction?contract=CreateAssetContract"
              >
                Create an Asset
              </Button>
            </Link>
          </Buttons>
        </LeftSide>

        <RightSide>
          <Image
            src="/images/dev-pointing-to-screen.jpeg"
            alt="Developer pointing to screen"
            width={550}
            height={350}
          />
        </RightSide>
      </Content>
    </BannerContainer>
  );
};
