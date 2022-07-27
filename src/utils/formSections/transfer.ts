import { ISection } from 'components/Form';

const transferContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        { label: 'Amount',
          props: {
            type: 'number',
            required: true,
            tooltip: 'Amount to be send (with precision)'
          },
        },
        {
          label: 'KDA',
          props: {
            required: true,
            tooltip: 'AssetID, if empty it defaults to KLV',
          },
        },
        {
          label: 'Receiver',
          props: { tooltip: 'Receiver address' }
        },
      ],
    });

    return section;
  };
  
  export default transferContract;
  