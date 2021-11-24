import React, { useState } from 'react';

import { Container, ItemContainer, Indicator, TabContainer } from './styles';

export interface ITabs {
  headers: string[];
  onClick?(header: string, index: number): void;
}

const Tabs: React.FC<ITabs> = ({ headers, onClick, children }) => {
  const [selected, setSelected] = useState(0);

  return (
    <Container>
      <TabContainer>
        {headers.map((header, index) => {
          const itemProps = {
            selected: index === selected,
            onClick: () => {
              if (onClick) {
                onClick(header, index);
              }
              setSelected(index);
            },
          };

          return (
            <ItemContainer key={String(index)} {...itemProps}>
              <span>{header}</span>
              <Indicator selected={index === selected} />
            </ItemContainer>
          );
        })}
      </TabContainer>

      {children}
    </Container>
  );
};

export default Tabs;
