import { PropsWithChildren } from 'react';
import { FAQDropdown } from './DropdownItem';
import { Content, FAQContainer, LeftSide, SiteTip, Title } from './styles';

const FAQCards = [
  {
    title: 'What is an initial Token Offering (ITO)?',
    description:
      'An ITO (Initial Token Offering) is a decentralized fundraising method that allows startups and established companies to raise capital by selling digital tokens to investors in exchange for cryptocurrencies.',
  },
  {
    title: 'Why choose KleverChain for my ITO?',
    description: `KleverChain offers several advantages for ITOs, including:
- Seamless User Experience: User-friendly and intuitive interface for you and your investors.
- Robust Security: Cutting-edge blockchain technology to protect your funds.
- Scalability and Flexibility: Grow with your project without compromising performance.
- Interoperability: Connect to other blockchains and expand your reach.
- Vibrant Community: Support from a community dedicated to your success.`,
  },
  {
    title: 'What are the different types of ITOs?',
    description: `There are currently two types of ITOs in KleverChain:
Public ITO: Open to all investors.
Private ITO: Accessible only to accredited investors determined in the ITO's whitelist.`,
  },
  {
    title: 'What are the risks of investing in an ITO?',
    description: `As with any investment, there are risks involved in investing in an ITO. Some of the risks to consider include:
Fraud Risk: Not all ITOs are legitimate. It is important to carefully research the project and team before investing.
Volatility Risk: The value of tokens can fluctuate significantly.`,
  },
  {
    title: 'How can I prepare to participate in an ITO?',
    description: `Do your own research: Learn about the project, the team, and the technology. #DYOR
Understand the risks: Evaluate the risks involved in the investment.
Have a cryptocurrency wallet: You will need a wallet to store your tokens.
Be ready to act quickly: ITOs can sell out quickly.`,
  },
];

export const LaunchPadFAQ: React.FC<PropsWithChildren> = () => {
  return (
    <FAQContainer>
      <LeftSide>
        <SiteTip>KLEVER.ORG</SiteTip>
        <Title>Frequently Asked Questions</Title>
      </LeftSide>
      <Content>
        {FAQCards.map((card, index) => (
          <FAQDropdown
            key={card.title}
            title={card.title}
            description={card.description}
          />
        ))}
      </Content>
    </FAQContainer>
  );
};
