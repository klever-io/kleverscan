import { Apple, GooglePlay } from '@/assets/icons';
import { useMobile } from '@/contexts/mobile';
import Image from 'next/image';
import { FaChrome } from 'react-icons/fa';
import { Button } from '../Banner/styles';
import { Description, Label, Title } from '../LearnBanner/styles';
import {
  BannerContainer,
  Content,
  LeftSide,
  LinkStyle,
  Links,
  RightSide,
} from './styles';

const links = [
  {
    icon: <Apple />,
    text: 'App Store',
    href: 'https://apps.apple.com/tt/app/klever-wallet/id1615064243',
  },
  {
    icon: <GooglePlay />,
    text: 'Google Play',
    href: 'https://play.google.com/store/apps/details?id=finance.klever.bitcoin.wallet',
  },
  {
    icon: <FaChrome size={20} />,
    text: 'Web Store',
    href: 'https://chromewebstore.google.com/detail/klever-wallet/ifclboecfhkjbpmhgehodcjpciihhmif',
  },
];

export const WalletBanner: React.FC = () => {
  const { isTablet } = useMobile();

  return (
    <BannerContainer>
      <Content>
        <LeftSide>
          <Label>Klever Wallet</Label>
          <Title>Managing your tokens with a Klever Wallet</Title>
          <Description>
            Maximize your project&apos;s potential with Klever Wallet post-ITO
            on KleverScan. A self-custodial{' '}
            <a href="https://klever.io/en-us/crypto-wallet" rel="nofollow">
              crypto wallet
            </a>
            enhances your token management, ensuring optimal security and
            seamless access across blockchains. Elevate your digital
            assets&apos; visibility and control with Klever Wallet
          </Description>
          {!isTablet ? (
            <Links>
              {links.map((link, index) => (
                <LinkStyle href={link.href} key={link.href} rel="nofollow">
                  {link.icon}
                  {link.text}
                </LinkStyle>
              ))}
            </Links>
          ) : (
            <Button
              href="https://onelink.to/455hxv"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Download Now!
            </Button>
          )}
        </LeftSide>

        <RightSide>
          <Image
            src="/images/crypto-wallet.png"
            alt="Developer pointing to screen"
            width={!isTablet ? 383 : 192}
            height={!isTablet ? 776 : 388}
            quality={100}
          />
        </RightSide>
      </Content>
    </BannerContainer>
  );
};
