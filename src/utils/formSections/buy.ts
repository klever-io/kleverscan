import { ISection } from 'components/Form';

const buyContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Buy Type',
        props: {
          type: 'checkbox',
          toggleOptions: ['ITO Buy', 'Market Buy'],
          defaultValue: 0,
        },
      },
      {
        label: 'Id',
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
