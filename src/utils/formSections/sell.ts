import { ISection } from 'components/Form';

const sellContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Market Type', props: { type: 'number', required: true } },
      { label: 'Marketplace ID', props: { required: true } },
      { label: 'Asset ID', props: { required: true } },
      { label: 'Currency ID', props: { required: true } },
      { 
        label: 'Price',
        props: {
          type: 'number',
        },
      },
      { 
        label: 'Reserve Price',
        props: {
          type: 'number',
        },
      },
      { 
        label: 'End Time',
        props: {
          type: 'number',
          required: true,
        },
      },
    ],
  });

  return section;
};
  
export default sellContract;
  