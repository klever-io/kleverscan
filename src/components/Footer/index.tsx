import React from 'react';

import {
  Container,
  Content,
  CreditsContainer,
  SectionContainer,
  Tag,
} from './styles';

import Logo from '../../assets/logo.svg';

import { contents, version } from '../../configs/footer';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <Container>
      <SectionContainer>
        <Content>
          <Logo />
        </Content>
        {contents.map((content, index) => (
          <Content key={index}>
            <span>
              <strong>{content.title}</strong>
            </span>
            {content.infoLinks.map((info, i) => (
              <Link key={String(i)} href={info.href} passHref>
                <Tag>{info.name}</Tag>
              </Link>
            ))}
          </Content>
        ))}
      </SectionContainer>
      <CreditsContainer>
        <span>
          Powered by{' '}
          <Link href="/">
            <Tag>Klever</Tag>
          </Link>
        </span>
        <span>{version}</span>
      </CreditsContainer>
    </Container>
  );
};

export default Footer;
