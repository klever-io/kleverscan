import { ISection } from 'components/Form';

const depositContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'KDA',
        props: {
          required: true,
          tooltip: 'Target Asset',
        },
      },
      {
        label: 'Currency ID',
        objectName: 'currencyId',
        props: {
          required: true,
          tooltip: 'Currency to be deposited',
        },
      },
      {
        label: 'Amount',
        props: {
          type: 'number',
          required: true,
          tooltip: 'Amount of currency to be deposited',
        },
      },
    ],
  });

  return section;
};

export default depositContract;
