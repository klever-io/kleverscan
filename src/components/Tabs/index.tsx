import { PropsWithChildren } from 'react';
import { getSelectedTab } from '@/utils/index';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Indicator,
  ItemContainer,
  TabContainer,
  TabContent,
} from './styles';

export interface ITabs {
  headers: string[];
  onClick?(header: string, index: number): void;
}

const Tabs: React.FC<PropsWithChildren<ITabs>> = ({
  headers,
  onClick,
  children,
}) => {
  const router = useRouter();
  const [selected, setSelected] = useState<number>(0);
  useEffect(() => {
    if (!router.isReady) return;
    setSelected(getSelectedTab(router.query.tab, headers));
  }, [router.isReady, router.query, headers]);

  return (
    <Container>
      <TabContainer>
        <TabContent>
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
              <ItemContainer
                key={String(index)}
                data-testid={`tab`}
                {...itemProps}
              >
                <span>{header}</span>
                <Indicator selected={index === selected} />
              </ItemContainer>
            );
          })}
        </TabContent>
      </TabContainer>
      <div data-testid={`tab-content-${selected}`}>{children}</div>
    </Container>
  );
};

export default Tabs;
