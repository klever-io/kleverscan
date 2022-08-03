import { ISection } from 'components/Form';

export const delegateContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Receiver',
        props: {
          required: true,
          tooltip: 'Address to be delegated to',
        },
      },
    ],
  });

  return section;
};
