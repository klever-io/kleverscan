import { ChevronRight, Copy as CopyIcon } from '@/assets/icons';
import {
  contents,
  description,
  IContent,
  ISocial,
  socials,
  walletDonate,
} from '@/configs/footer';
import { useMobile } from '@/contexts/mobile';
import Image from 'next/image';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import React, { useCallback, useRef, useState } from 'react';
import packageJson from '../../../package.json';
import Copy from '../Copy';
import {
  Container,
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

const Footer: React.FC = () => {
  const { isMobile } = useMobile();
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [qrCodeDropDown, setQrCodeDropDown] = useState(false);
  const SocialItem: React.FC<ISocial> = ({ Icon, link }) => (
    <a target="_blank" href={link} rel="noreferrer">
      <SocialIcon>
        <Icon />
      </SocialIcon>
    </a>
  );

  const getReducedLinks = useCallback(() => {
    const reduced = contents.reduce((acc: IContent[][], _, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }
      return acc;
    }, []);

    return reduced;
  }, []);

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
    <Container>
      <Content>
        <DescriptionContainer>
          <LogoContainer>
            <Image src="/logo-small.svg" alt="Logo" width="224" height="28" />
          </LogoContainer>
          <span>{description}</span>
          <SocialContainer>
            {socials.map((social, index) => (
              <SocialItem key={String(index)} {...social} />
            ))}
          </SocialContainer>
          {!isMobile && (
            <VersionBuildContainer>
              <p>BUILD VERSION {packageJson.version}</p>
            </VersionBuildContainer>
          )}
        </DescriptionContainer>

        {getReducedLinks().map((links, containerIndex) => (
          <LinksContainer key={String(containerIndex)}>
            {links.map((link, linkIndex) => (
              <LinkItems key={String(linkIndex)}>
                <span>{link.title}</span>
                {link.infoLinks.map((item, index) =>
                  item.name === 'KLV' ? (
                    <DonateContainer key={String(index)} {...dropdownProps}>
                      <Copy info="Donation Address" data={walletDonate}>
                        <p>
                          <ChevronRight />
                          {item.name}
                          <CopyIcon />
                        </p>
                      </Copy>
                      <QrCodeDropdown
                        {...dropdownProps}
                        active={qrCodeDropDown}
                      >
                        <div>
                          <QRCodeSVG value={walletDonate} />
                        </div>
                      </QrCodeDropdown>
                    </DonateContainer>
                  ) : (
                    <Link key={String(index)} href={item.href}>
                      <a>
                        <ChevronRight />
                        {item.name}
                      </a>
                    </Link>
                  ),
                )}
              </LinkItems>
            ))}
          </LinksContainer>
        ))}
        {isMobile && (
          <VersionBuildContainer>
            <p>BUILD VERSION {packageJson.version}</p>
          </VersionBuildContainer>
        )}
      </Content>
    </Container>
  );
};

export default Footer;
