import { ISection } from 'components/Form';

const transferContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Amount',
        props: {
          type: 'number',
          required: true,
          tooltip: 'Amount to be sent',
        },
      },
      {
        label: 'Receiver Address',
      },
    ],
  });

  return section;
};

export default transferContract;
