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
          props: {
            required: true,
          },
        },
      ],
    });

    return section;
  };
  
  export default transferContract;
  