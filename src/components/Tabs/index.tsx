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
  /**
   * When set, the parent owns which tab is highlighted. -1 highlights none,
   * which is how a page avoids painting the first tab before it has read the
   * URL. Omitted, the tab still follows `router.query.tab` itself.
   */
  selectedIndex?: number;
}

const Tabs: React.FC<PropsWithChildren<ITabs>> = ({
  headers,
  onClick,
  children,
  selectedIndex,
}) => {
  const router = useRouter();
  const [selected, setSelected] = useState<number>(0);
  const active = selectedIndex === undefined ? selected : selectedIndex;
  useEffect(() => {
    if (selectedIndex !== undefined || !router.isReady) return;
    setSelected(getSelectedTab(router.query.tab, headers));
  }, [router.isReady, router.query, headers, selectedIndex]);

  return (
    <Container>
      <TabContainer>
        <TabContent>
          {headers.map((header, index) => {
            const itemProps = {
              selected: index === active,
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
                <Indicator selected={index === active} />
              </ItemContainer>
            );
          })}
        </TabContent>
      </TabContainer>
      <div data-testid={`tab-content-${active}`}>{children}</div>
    </Container>
  );
};

export default Tabs;
