import { PropsWithChildren } from 'react';
import { getSelectedTab } from '@/utils/index';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DateFilter from '../DateFilter';
import {
  Container,
  FilterContent,
  Indicator,
  ItemContainer,
  TabContainer,
  TabContent,
} from './styles';

export interface ITabs {
  headers: string[];
  onClick?(header: string, index: number): void;
  showDataFilter?: boolean;
}

const Tabs: React.FC<PropsWithChildren<ITabs>> = ({
  headers,
  onClick,
  children,
  showDataFilter = true,
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
              <ItemContainer key={String(index)} {...itemProps}>
                <span>{header}</span>
                <Indicator selected={index === selected} />
              </ItemContainer>
            );
          })}
        </TabContent>
        {headers[selected] === 'Transactions' && (
          <FilterContent showDataFilter={showDataFilter}>
            {showDataFilter && (
              <div>
                <DateFilter />
              </div>
            )}
          </FilterContent>
        )}
      </TabContainer>
      {children}
    </Container>
  );
};

export default Tabs;
