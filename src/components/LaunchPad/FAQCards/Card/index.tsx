import { Arrow } from '@/assets/icons';
import {
  CardContainer,
  Content,
  Description,
  FAQAction,
  Title,
} from './styles';

export const FAQCard: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <CardContainer>
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
      <FAQAction>
        Learn more <Arrow />
      </FAQAction>
    </CardContainer>
  );
};
