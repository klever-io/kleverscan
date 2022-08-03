import { ISection } from 'components/Form';

const voteContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        {
          label: 'Amount',
          props: {
            type: 'number',
            required: true,
            tooltip: 'Weight of the vote, maximum amount depends on KFI of address',
          },
        },
        {
          label: 'Type',
          props: {
            type: 'checkbox',
            toggleOptions: ['Yes', 'No'],
            defaultValue: 0,
            tooltip: 'Vote yes or vote no',
          },
        },
      ],
    });

    return section;
  };
  
  export default voteContract;
  