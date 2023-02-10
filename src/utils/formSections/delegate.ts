import { ISection } from 'components/Form';

export const delegateContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Validator Address',
        props: {
          required: true,
          tooltip: 'Validator to whom the bucket will be delegated',
        },
      },
    ],
  });

  return section;
};
