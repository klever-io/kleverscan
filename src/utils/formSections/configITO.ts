import { ISection } from 'components/Form';

const configITOContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push(
    {
      fields: [
        {
          label: 'Receiver Address',
          props: {
            required: true,
            tooltip: 'Wallet address that will receive the currency',
          },
        },
        {
          label: 'Status',
          props: {
            type: 'checkbox',
            toggleOptions: ['Inactive', 'Active'],
            defaultValue: 0,
          },
        },
        {
          label: 'Max Amount',
          props: {
            type: 'number',
            required: true,
            tooltip: 'Max amount of assets sold in the ITO',
          },
        },
    ],
    },
  );

  return section;
};
  
export default configITOContract;
