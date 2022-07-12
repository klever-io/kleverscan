import { ISection } from 'components/Form';

const voteContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        { label: 'Proposal ID', props: { type: 'number', required: true } },
        {
          label: 'Amount',
          props: { type: 'number', required: true },
        },
        {
          label: 'Type',
          props: {
            type: 'number',
            required: true,
          },
        },
      ],
    });

    return section;
  };
  
  export default voteContract;
  