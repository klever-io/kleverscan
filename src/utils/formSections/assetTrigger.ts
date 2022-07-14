import { ISection } from 'components/Form';

const assetTriggerContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push(
    {
      fields: [
        { label: 'AssetID', props: { required: true } },
        { label: 'Receiver', props: { required: true } },
        { label: 'Amount', props: { type: 'number', required: true } },
        { label: 'MIME', props: { required: true } },
        { label: 'Logo', props: { required: true } },
      ],
    },
    {
      title: 'Uris',

      fields: [
        {
          label: 'Uri',
          props: {
            type: 'struct',
            array: true,
            innerSection: {
              title: 'Uri',
              inner: true,
              innerPath: 'uris',
              fields: [
                {
                  label: 'Label',
                },
                {
                  label: 'Address',
                },
              ],
            },
          },
        },
      ],
    },
    {
      title: 'Roles',
      fields: [
        {
          label: 'Roles',
          props: {
            type: 'struct',
            array: true,
            innerSection: {
              title: 'Roles',
              inner: true,
              innerPath: 'roles',
              fields: [
                {
                  label: 'Address',
                  props: {
                    span: 2,
                  },
                },
                {
                  label: 'Has Role Mint',
                  props: {
                    type: 'checkbox',
                    toggleOptions: ['No', 'Yes'],
                    bool: true,
                  },
                },
                {
                  label: 'Has Role Set ITO Prices',
                  props: {
                    type: 'checkbox',
                    toggleOptions: ['No', 'Yes'],
                    bool: true,
                  },
                },
              ],
            },
          },
        },
      ],
    },
    {
      title: 'Staking',
      fields: [
        {
          label: 'Type',
          props: {
            type: 'checkbox',
            toggleOptions: ['APR', 'FPR'],
            defaultValue: 0,
            disabled: true,
          },
        },
        {
          label: 'APR',
          props: {
            type: 'number',
          },
        },
        {
          label: 'Min Epochs To Claim',
          props: {
            type: 'number',
          },
        },
        {
          label: 'Min Epochs To Unstake',
          props: {
            type: 'number',
          },
        },
        {
          label: 'Min Epochs To Withdraw',
          props: {
            type: 'number',
          },
        },
      ],
    }
  );

  return section;
};
  
export default assetTriggerContract;
