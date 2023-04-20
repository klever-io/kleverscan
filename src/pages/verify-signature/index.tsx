import { Validators as Icon } from '@/assets/cards';
import FormVerifySignature from '@/components/Form/FormVerifySignature';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
} from '@/components/Form/FormVerifySignature/styles';
import Title from '@/components/Layout/Title';
import { Container, Content, Header } from '@/views/verify-signature/detail';
import { useState } from 'react';

const VerifySignature: React.FC = () => {
  const cardHeaders = ['Verify Signature'];
  const [selectedCard, setSelectedCard] = useState<string>(cardHeaders[0]);

  const SelectedComponent: React.FC = () => {
    switch (selectedCard) {
      case 'Verify Signature':
        return <FormVerifySignature />;
      default:
        return <div />;
    }
  };

  return (
    <Container>
      <Header>
        <Title title="Verify" Icon={Icon} />
      </Header>
      <Content>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => setSelectedCard(header)}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>
        <CardContent>
          <SelectedComponent />
        </CardContent>
      </Content>
    </Container>
  );
};

export default VerifySignature;
