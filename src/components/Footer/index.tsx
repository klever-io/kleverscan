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
              <Tag key={String(i)} target="_blank" href={info.href}>
                {info.name}
              </Tag>
            ))}
          </Content>
        ))}
      </SectionContainer>
      <CreditsContainer>
        <span>
          Powered by{' '}
          <Tag target="_blank" href="https://klever.finance/" rel="noreferrer">
            Klever Finance
          </Tag>
        </span>
        <span>{version}</span>
      </CreditsContainer>
    </Container>
  );
};

export default Footer;
