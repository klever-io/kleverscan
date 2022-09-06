import { ISection } from 'components/Form';

const claimContract = (labelId: string): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: labelId,
        props: {
          required: true,
        },
      },
    ],
  });

  return section;
};

export default claimContract;
