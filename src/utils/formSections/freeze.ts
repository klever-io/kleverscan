import { ISection } from 'components/Form';

export const freezeContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Amount',
        props: {
          type: 'number',
          required: true,
          tooltip: 'Amount to be frozen',
        },
      },
    ],
  });

  return section;
};
