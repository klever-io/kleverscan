import { FAQCard } from './Card';
import { FAQContainer } from './styles';

const FAQCards = [
  {
    title: 'What is Klever ITO?',
    description:
      'Klever ITO is a token launch platform for decentralized projects.',
    buttonLabel: 'Read more on Klever Forum',
  },
  {
    title: 'Why Create on KleverChain?',
    description:
      'KleverChain: User-friendly, secure, scalable platform with strong community support.',
    buttonLabel: 'Read more on Klever Forum',
  },
  {
    title: 'How to create an ITO on KleverChain?',
    description: 'Initial Token Offering in easy 6-steps with KleverScan',
    buttonLabel: 'Learn how to create an ITO',
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
