import React from 'react';

import { Container, Subtitle } from '../views/notFound';

import Input from '../components/Input';

const NotFound: React.FC = () => {
  return (
    <Container>
      <div>
        <strong>Page</strong>
        <span> not found</span>
      </div>
      <Subtitle>
        Please re-search or double-click the information provided
      </Subtitle>

      <Input />
    </Container>
  );
};

export default NotFound;
