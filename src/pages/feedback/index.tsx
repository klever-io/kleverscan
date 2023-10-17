import { Accounts as Icon } from '@/assets/title-icons';
import Feedback from '@/components/Feedback';
import Title from '@/components/Layout/Title';
import { Container, Header } from '@/styles/common';

const FeedbackPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title title="Feedback" Icon={Icon} />
      </Header>

      <Feedback />
    </Container>
  );
};

export default FeedbackPage;
