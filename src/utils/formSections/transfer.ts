import { ISection } from 'components/Form';

const transferContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        { label: 'Amount',
          props: {
            type: 'number',
            required: true,
            tooltip: 'Amount to be send'
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
  