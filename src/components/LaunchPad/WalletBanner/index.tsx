import { AppGalery, Apple, GooglePlay, QRCode } from '@/assets/icons';
import Image from 'next/image';
import Link from 'next/link';
import {
  BannerContainer,
  Content,
  Description,
  Label,
  LeftSide,
  Links,
  LinkStyle,
  RightSide,
  Title,
} from './styles';

const links = [
  {
    icon: <Apple />,
    text: 'App Store',
    href: '#',
  },
  {
    icon: <GooglePlay />,
    text: 'Google Play',
    href: '#',
  },
  {
    icon: <AppGalery />,
    text: 'App Gallery',
    href: '#',
  },
];

export const WalletBanner: React.FC = () => {
  return (
    <BannerContainer>
      <Content>
        <LeftSide>
          <Label>Klever Wallet</Label>
          <Title>Managing your tokens with a Klever Wallet</Title>
          <Description>
            Maximize your project&apos;s potential with Klever Wallet post-ITO
            on KleverScan. A self-custodial{' '}
            <a href="https://klever.io/en-us/crypto-wallet">crypto wallet</a>
            enhances your token management, ensuring optimal security and
            seamless access across blockchains. Elevate your digital
            assets&apos; visibility and control with Klever Wallet
          </Description>
          <Links>
            {links.map((link, index) => (
              <Link key={index} href={link.href}>
                <LinkStyle href={link.href}>
                  {link.icon}
                  {link.text}
                </LinkStyle>
              </Link>
            ))}
            <LinkStyle>
              <QRCode />
            </LinkStyle>
          </Links>
        </LeftSide>

        <RightSide>
          <Image
            src="/images/crypto-wallet.png"
            alt="Developer pointing to screen"
            width={400}
            height={750}
          />
        </RightSide>
      </Content>
    </BannerContainer>
  );
};
