import { ISection } from 'components/Form';

const claimContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
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
  