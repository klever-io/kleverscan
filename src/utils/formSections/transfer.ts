import { ISection } from 'components/Form';

const transferContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        { label: 'Amount', props: { type: 'number', required: true } },
        {
          label: 'AssetID',
          props: { required: true },
        },
        {
          label: 'Receiver',
        },
      ],
    });

    return section;
  };
  
  export default transferContract;
  