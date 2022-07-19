import { ISection } from 'components/Form';

const configITOContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push(
    {
      fields: [
        {
          label: 'AssetID',
          props: {
            required: true,
            tooltip: 'Target Asset',
          },
        },
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
            tooltip: 'Max amount of assets sold in the ITO (with precision)',
          },
        },
    ],
    },
  );

  return section;
};
  
export default configITOContract;
