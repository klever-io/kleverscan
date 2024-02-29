import { FAQDropdown } from './DropdownItem';
import { Content, FAQContainer, LeftSide, SiteTip, Title } from './styles';

const FAQCards = [
  {
    title: 'Do you have a project and want to bring it to KleverChain?',
    description:
      "Before getting started, let's dig into KleverPad and what it stands for",
  },
  {
    title: 'Do you have a project and want to bring it to KleverChain?',
    description: 'Get to know more about the ITO allocation system here',
  },
  {
    title: 'Do you have a project and want to bring it to KleverChain?',
    description:
      'Time for action! This guide enlights you on your blockchain gaming path',
  },
  {
    title: 'Do you have a project and want to bring it to KleverChain?',
    description:
      'Time for action! This guide enlights you on your blockchain gaming path',
  },
];

export const LaunchPadFAQ: React.FC = () => {
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
