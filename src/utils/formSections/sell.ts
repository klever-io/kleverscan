import { ISection } from 'components/Form';

const sellContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Market Type',
        props: {
          type: 'checkbox',
          toggleOptions: ['Instant Sell', 'Auction'],
          defaultValue: 0,
        },
      },
      {
        label: 'Marketplace Id',
        props: {
          required: true,
          tooltip: 'Maketplace ID in which the sell order will be created',
        },
      },
      {
        label: 'Currency ID',
        props: {
          required: true,
          tooltip: 'Transaction currency token',
        },
      },
      {
        label: 'Price',
        props: {
          type: 'number',
          tooltip: 'Price for instant sell',
        },
      },
      {
        label: 'Reserve Price',
        props: {
          type: 'number',
          tooltip: 'Minimum auction price',
        },
      },
      {
        label: 'End Time',
        props: {
          type: 'datetime-local',
          required: true,
          tooltip: 'Expiration sell date',
        },
      },
    ],
  });

  return section;
};

export default sellContract;
