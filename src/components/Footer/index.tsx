import React from 'react';

import Link from 'next/link';

import {
  Container,
  DescriptionContainer,
  LinkItems,
  LinksContainer,
  SocialContainer,
  SocialIcon,
} from './styles';

import Logo from '../../assets/logo.svg';
import {
  contents,
  description,
  IContent,
  ISocial,
  socials,
} from '@/configs/footer';

const Footer: React.FC = () => {
  const SocialItem: React.FC<ISocial> = ({ name, link }) => (
    <a target="_blank" href={link} rel="noreferrer">
      <SocialIcon>{name.charAt(0).toUpperCase()}</SocialIcon>
    </a>
  );

  const getReducedLinks = () => {
    const reduced = contents.reduce((acc: IContent[][], _, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }
      return acc;
    }, []);

    return reduced;
  };

  return (
    <Container>
      <DescriptionContainer>
        <Logo />
        <span>{description}</span>
        <SocialContainer>
          {socials.map((social, index) => (
            <SocialItem key={String(index)} {...social} />
          ))}
        </SocialContainer>
      </DescriptionContainer>

      {getReducedLinks().map((links, containerIndex) => (
        <LinksContainer key={String(containerIndex)}>
          {links.map((link, linkIndex) => (
            <LinkItems key={String(linkIndex)}>
              <span>{link.title}</span>
              {link.infoLinks.map((item, index) => (
                <Link key={String(index)} href={item.href}>
                  {item.name}
                </Link>
              ))}
            </LinkItems>
          ))}
        </LinksContainer>
      ))}
    </Container>
  );
};

export default Footer;
