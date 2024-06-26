import { PropsWithChildren } from 'react';
import { Copy as CopyIcon } from '@/assets/icons';
import {
  contents,
  description,
  IContent,
  ISocial,
  socials,
  walletDonate,
} from '@/configs/footer';
import { useMobile } from '@/contexts/mobile';
import { useTheme } from '@/contexts/theme';
import { ArrowUpSquareHideMenu } from '@/views/home';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import React, { useRef, useState } from 'react';
import packageJson from '../../../package.json';
import Copy from '../Copy';
import {
  Container,
  ContainerHeaderItems,
  Content,
  DescriptionContainer,
  DonateContainer,
  LinkItems,
  LinksContainer,
  LogoContainer,
  QrCodeDropdown,
  SocialContainer,
  SocialIcon,
  VersionBuildContainer,
} from './styles';

const FooterItems: React.FC<PropsWithChildren<IContent>> = link => {
  const [hideMenu, setHideMenu] = useState(false);
  const { isMobile } = useMobile();
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [qrCodeDropDown, setQrCodeDropDown] = useState(false);
  const handleMouseEnter = () => {
    closeTimeout.current !== null && clearTimeout(closeTimeout.current);
    setQrCodeDropDown(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current !== null && clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setQrCodeDropDown(false);
    }, 500);
  };
  const dropdownProps = {
    onMouseOver: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return (
    <LinksContainer>
      <LinkItems>
        <ContainerHeaderItems>
          <span>{link.title}</span>
          {isMobile && (
            <div onClick={() => setHideMenu(!hideMenu)}>
              <p>{hideMenu ? 'Show' : 'Hide'}</p>
              <ArrowUpSquareHideMenu $hide={hideMenu} />
            </div>
          )}
        </ContainerHeaderItems>
        {!hideMenu &&
          link.infoLinks.map((item, index) =>
            item.name === 'KLV' ? (
              <DonateContainer key={String(index)} {...dropdownProps}>
                <Copy info="Donation Address" data={walletDonate}>
                  <p>
                    {item.name}
                    <CopyIcon />
                  </p>
                </Copy>
                <QrCodeDropdown {...dropdownProps} active={qrCodeDropDown}>
                  <div>
                    <QRCodeSVG value={walletDonate} />
                  </div>
                </QrCodeDropdown>
              </DonateContainer>
            ) : (
              <Link
                key={String(index)}
                href={item.href}
                target="_blank"
                rel="nofollow noreferrer"
              >
                {item.name}
              </Link>
            ),
          )}
      </LinkItems>
    </LinksContainer>
  );
};

const Footer: React.FC<PropsWithChildren> = () => {
  const { isMobile } = useMobile();
  const { isDarkTheme } = useTheme();
  const SocialItem: React.FC<PropsWithChildren<ISocial>> = ({ Icon, link }) => (
    <a
      target="_blank"
      href={link}
      rel="nofollow noreferrer"
      data-testid={`social-item`}
    >
      <SocialIcon>
        <Icon />
      </SocialIcon>
    </a>
  );

  return (
    <Container>
      <Content>
        <DescriptionContainer>
          <LogoContainer>
            <Image
              src={isDarkTheme ? '/logo-large.svg' : '/Logo.svg'}
              alt="Logo"
              width="215"
              height="29"
              loader={({ src, width }) => `${src}?w=${width}`}
            />
          </LogoContainer>
          <span>{description}</span>
          {!isMobile && (
            <>
              <SocialContainer>
                {socials.map((social, index) => (
                  <SocialItem key={String(index)} {...social} />
                ))}
              </SocialContainer>
              <VersionBuildContainer>
                <p>BUILD VERSION {packageJson.version}</p>
              </VersionBuildContainer>
            </>
          )}
        </DescriptionContainer>

        {contents.map((link, containerIndex) => (
          <FooterItems key={String(containerIndex)} {...link} />
        ))}

        {isMobile && (
          <>
            <SocialContainer>
              {socials.map((social, index) => (
                <SocialItem key={String(index)} {...social} />
              ))}
            </SocialContainer>
            <VersionBuildContainer>
              <p>BUILD VERSION {packageJson.version}</p>
            </VersionBuildContainer>
          </>
        )}
      </Content>
    </Container>
  );
};

export default Footer;
