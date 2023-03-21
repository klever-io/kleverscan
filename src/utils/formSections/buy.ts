import { ISection } from '@/components/Form';

const buyContract = (buyType = true): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: buyType ? 'Order ID' : 'ITO Asset ID',
        props: {
          required: true,
          tooltip: buyType
            ? 'MarketBuy: Sell Order ID'
            : 'ITOBuy: Asset ID of the KDA you want to buy from the ITO',
        },
      },
      {
        label: 'Currency Id',
        props: {
          required: true,
          tooltip: 'ID of the trade currency',
        },
      },
      {
        label: 'Amount',
        props: {
          type: 'number',
          required: true,
          tooltip: buyType
            ? 'MarketBuy: item price / amount bidden'
            : 'ITOBuy: Amount to be bought',
        },
      },
    ],
  });

  return section;
};

export default buyContract;
