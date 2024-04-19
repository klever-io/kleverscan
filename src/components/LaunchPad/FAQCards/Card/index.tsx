import { Arrow } from '@/assets/icons';
import {
  CardContainer,
  Content,
  Description,
  FAQAction,
  Title,
} from './styles';

export const FAQCard: React.FC<{
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
}> = ({ title, description, buttonLabel, buttonLink }) => {
  return (
    <CardContainer>
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
      <FAQAction
        href={buttonLink}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        {buttonLabel} <Arrow />
      </FAQAction>
    </CardContainer>
  );
};
