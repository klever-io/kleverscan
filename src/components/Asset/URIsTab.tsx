import { EmptyRow } from '@/components/Table/styles';
import { Row } from '@/views/assets/detail';
import React from 'react';
import { AssetProps } from './OverviewTab';

export const UrisTab: React.FC<AssetProps> = ({ asset }) => {
  return (
    <>
      {Object.entries(asset?.uris || []).length ? (
        Object.entries(asset?.uris || []).map(
          ([key, value]: [string, string]) => (
            <Row key={String(key)} isStakingRoyalties={false} span={2}>
              <span>
                <strong>{key}</strong>
              </span>
              <div>
                <a href={`${value}`} target="blank">
                  {value}
                </a>
              </div>
            </Row>
          ),
        )
      ) : (
        <EmptyRow type="assets">
          <p>No URI found</p>
        </EmptyRow>
      )}
    </>
  );
};
