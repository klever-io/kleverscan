import { ChevronRight } from '@/assets/icons';
import {
  contents,
  description,
  IContent,
  ISocial,
  socials,
} from '@/configs/footer';
import { useMobile } from '@/contexts/mobile';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';
import packageJson from '../../../package.json';
import {
  Container,
  Content,
  DescriptionContainer,
  LinkItems,
  LinksContainer,
  LogoContainer,
  SocialContainer,
  SocialIcon,
  VersionBuildContainer,
} from './styles';

const Footer: React.FC = () => {
  const { isMobile } = useMobile();
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
                {link.infoLinks.map((item, index) => (
                  <Link key={String(index)} href={item.href}>
                    <a>
                      <ChevronRight />
                      {item.name}
                    </a>
                  </Link>
                ))}
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
