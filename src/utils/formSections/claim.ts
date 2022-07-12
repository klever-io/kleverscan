import { ISection } from 'components/Form';

const claimContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Claim Type', props: { type: 'number', required: true } },
      {
          label: 'Id',
          props: {
            required: true,
          },
      },
    ],
  });

  return section;
};
  
export default claimContract;
  