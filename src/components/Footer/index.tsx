import React from 'react';

import {
  Container,
  Content,
  CreditsContainer,
  SectionContainer,
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
              <Link key={i} href={info.href} passHref>
                {info.name}
              </Link>
            ))}
          </Content>
        ))}
      </SectionContainer>
      <CreditsContainer>
        <span>
          Powered by <Link href="/">Getty/IO</Link>
        </span>
        <span>{version}</span>
      </CreditsContainer>
    </Container>
  );
};

export default Footer;
