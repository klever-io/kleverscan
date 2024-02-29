import { FAQCard } from './Card';
import { FAQContainer } from './styles';

const FAQCards = [
  {
    title: 'What is Klever LaunchPad?',
    description:
      "Before getting started, let's dig into KleverPad and what it stands for",
  },
  {
    title: 'Tier System',
    description: 'Get to know more about the ITO allocation system here',
  },
  {
    title: 'How to get started',
    description:
      'Time for action! This guide enlights you on your blockchain gaming path',
  },
];

export const LaunchPadFAQCards: React.FC = () => {
  return (
    <FAQContainer>
      {FAQCards.map((card, index) => (
        <FAQCard
          key={card.title}
          title={card.title}
          description={card.description}
        />
      ))}
    </FAQContainer>
  );
};
