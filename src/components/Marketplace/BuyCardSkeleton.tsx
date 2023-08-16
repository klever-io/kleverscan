import {
  GridItemFlex,
  MainItemsDiv,
  SkeletonImg,
} from '@/views/marketplaces/detail';
import { ReactElement } from 'react';
import Skeleton from '../Skeleton';

export const BuyCardSkeleton = (): ReactElement => {
  return (
    <MainItemsDiv>
      <SkeletonImg>
        <Skeleton
          width={80}
          height={80}
          customStyles={{ borderRadius: '50%' }}
        />
      </SkeletonImg>
      <GridItemFlex>
        <span>
          <Skeleton width={130} />
        </span>
        <span>
          <Skeleton width={130} />
        </span>
      </GridItemFlex>
      <GridItemFlex>
        <span>
          <Skeleton width={130} />
        </span>
        <span>
          <Skeleton width={130} />
        </span>
      </GridItemFlex>
      <GridItemFlex>
        <span>
          <Skeleton width={130} />
        </span>
        <span>
          <Skeleton width={130} />
        </span>
      </GridItemFlex>
      <GridItemFlex>
        <Skeleton width={'100%'} height={40} />
      </GridItemFlex>
    </MainItemsDiv>
  );
};
