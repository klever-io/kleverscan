import { ISection } from 'components/Form';

const assetTriggerContract = (): ISection[] => {
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
          label: 'Receiver',
          props: {
            tooltip: 'Target address for transaction',
          }
        },
        {
          label: 'Amount',
          props: {
            type: 'number',
            tooltip: 'Amount (with precision)',
          },
        },
        {
          label: 'MIME',
          props: {
            tooltip: 'The nature and format of the metadata',
          }
        },
        {
          label: 'Logo',
          props: {
            tooltip: 'Logo image URL',
          }
        },
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
                  props: {
                    tooltip: 'URI identifier. Ex: "foo"',
                  }
                },
                {
                  label: 'Address',
                  props: {
                    tooltip: 'URI address. Ex: "http://bar.com"',
                  }
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
                    tooltip: 'Target Address',
                  },
                },
                {
                  label: 'Has Role Mint',
                  props: {
                    type: 'checkbox',
                    toggleOptions: ['No', 'Yes'],
                    bool: true,
                    tooltip: 'Should be able to mint?',
                  },
                },
                {
                  label: 'Has Role Set ITO Prices',
                  props: {
                    type: 'checkbox',
                    toggleOptions: ['No', 'Yes'],
                    bool: true,
                    tooltip: 'Should be able to set ITO prices?',
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
            tooltip: 'Percentage',
          },
        },
        {
          label: 'Min Epochs To Claim',
          props: {
            type: 'number',
            tooltip: 'Minimum epochs to claim rewards',
          },
        },
        {
          label: 'Min Epochs To Unstake',
          props: {
            type: 'number',
            tooltip: 'Minimum epochs to unstake',
          },
        },
        {
          label: 'Min Epochs To Withdraw',
          props: {
            type: 'number',
            tooltip: 'Minimum epochs to withdraw after unstake',
          },
        },
      ],
    }
  );

  return section;
};
  
export default assetTriggerContract;
