import { ISection } from '@/components/Form';

const voteContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Amount',
        props: {
          type: 'number',
          required: true,
          tooltip: 'Weight depends on the amount of KFI held',
        },
      },
      {
        label: 'Type',
        props: {
          type: 'checkbox',
          toggleOptions: ['Yes', 'No'],
          defaultValue: 0,
          tooltip: 'Vote yes or vote no',
        },
      },
    ],
  });

  return section;
};

export default voteContract;
