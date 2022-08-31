import { ISection } from 'components/Form';

const buyContract = (labelId: string): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: labelId,
        props: {
          required: true,
          tooltip: 'ITOBuy: ITO Asset ID, MarketBuy: order ID',
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
          tooltip:
            'ITOBuy: Amount to be bought, MarkeyBuy: item price / amount bidden (check precision)',
        },
      },
    ],
  });

  return section;
};

export default buyContract;
