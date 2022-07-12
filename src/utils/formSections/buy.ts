import { ISection } from 'components/Form';

const buyContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Buy Type', props: { type: 'number', required: true } },
      {
          label: 'Id',
          props: {
            required: true,
          },
      },
      {
          label: 'Currency Id',
          props: {
            required: true,
          },
      },
      {
        label: 'Amount',
        props: { type: 'number', required: true },
      },
    ],
  });

  return section;
};
  
export default buyContract;
  