import { FAQCard } from './Card';
import { FAQContainer } from './styles';

const FAQCards = [
  {
    title: 'What is Klever ITO?',
    description:
      'Klever ITO is a token launch platform for decentralized projects.',
    buttonLabel: 'Read more on Klever Forum',
    buttonLink:
      'https://forum.klever.org/t/understanding-initial-token-offerings-itos-a-comprehensive-guide/1049',
  },
  {
    title: 'Why Create on KleverChain?',
    description:
      'KleverChain: User-friendly, secure, scalable platform with strong community support.',
    buttonLabel: 'Read more on Klever Forum',
    buttonLink:
      'https://forum.klever.org/t/unleash-your-potential-launch-your-ito-on-kleverchain/1050',
  },
  {
    title: 'How to create an ITO on KleverChain?',
    description: 'Initial Token Offering in easy 6-steps with KleverScan',
    buttonLabel: 'Learn how to create an ITO',
    buttonLink:
      'https://forum.klever.org/t/how-to-create-your-initial-token-offering-ito-on-kleverchain-using-kleverscan/36',
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
          buttonLabel={card.buttonLabel}
          buttonLink={card.buttonLink}
        />
      ))}
    </FAQContainer>
  );
};
