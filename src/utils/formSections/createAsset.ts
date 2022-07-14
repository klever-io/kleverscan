import { ISection } from '@/types/index';

const createAsset = (type: string, address = ''): ISection[] => {
  const section = [] as ISection[];

  switch (type) {
    case 'Token':
      section.push(
        {
          fields: [
            { label: 'Name', props: { required: true } },
            {
              label: 'Ticker',
              props: { required: true },
            },
            {
              label: 'Owner',
              props: {
                required: true,
                defaultValue: address,
              },
            },
            {
              label: 'Precision',
              props: {
                type: 'number',
                required: true,
              },
            },
            {
              label: 'Initial Supply',
              props: {
                type: 'number',
              },
            },
            {
              label: 'Max Supply',
              props: {
                type: 'number',
              },
            },
            {
              label: 'Logo',
              props: {
                span: 2,
              },
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
          title: 'Royalties',
          fields: [
            {
              label: 'Address',
              props: {
                required: true,
                span: 2,
              },
            },
            {
              label: 'Transfer Percentage',
              props: {
                type: 'struct',
                array: true,
                innerSection: {
                  title: 'Royalty Info',
                  inner: true,
                  innerPath: 'royalties.transferPercentage',
                  fields: [
                    {
                      label: 'Amount',
                      props: {
                        type: 'number',
                      },
                    },
                    {
                      label: 'Percentage',
                      props: {
                        type: 'number',
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
            { label: 'APR', props: { type: 'number' } },
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
          title: 'Properties',
          fields: [
            {
              label: 'Can Freeze',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should be freezable?',
              },
            },
            {
              label: 'Can Wipe',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                defaultValue: 'false',
                tooltip: 'Should be wipeable?',
              },
            },
            {
              label: 'Can Pause',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should be pausable?',
              },
            },
            {
              label: 'Can Mint',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should be mintable?',
              },
            },
            {
              label: 'Can Burn',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should be burnable?',
              },
            },
            {
              label: 'Can Change Owner',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should the owner be changeable?',
              },
            },
            {
              label: 'Can Add Roles',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should roles be add-able?',
              },
            },
          ],
        },
      );
      break;

    case 'NFT':
      section.push(
        {
          fields: [
            { label: 'Name', props: { required: true, tooltip: 'Token name' } },
            {
              label: 'Ticker',
              props: { required: true, tooltip: 'Token shorthand' },
            },
            {
              label: 'Owner',
              props: {
                required: true,
                defaultValue: address,
                tooltip: 'Owner address',
              },
            },
            {
              label: 'Max Supply',
              props: {
                type: 'number',
                tooltip: 'Maximum number of NFTs that can exist',
              },
            },
            {
              label: 'Logo',
              props: {
                span: 2,
                tooltip: 'URL of the tokens logo',
              },
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
                        tooltip: 'Uri identifier',
                      },
                    },
                    {
                      label: 'Address',
                      props: {
                        tooltip: 'Uri address',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          title: 'Royalties',
          fields: [
            {
              label: 'Address',
              props: {
                required: true,
                tooltip: 'Target Address',
              },
            },
            {
              label: 'Market Fixed',
              props: {
                type: 'number',
                tooltip: 'Fixed KLV amount in each market transaction',
              },
            },
            {
              label: 'Market Percentage',
              props: {
                type: 'number',
                tooltip: 'Percentage KLV amount in each market transaction',
              },
            },
            {
              label: 'Transfer Fixed',
              props: {
                type: 'number',
                tooltip: 'Fixed KLV amount in each transfer transaction',
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
          title: 'Properties',
          fields: [
            {
              label: 'Can Freeze',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should be freezable?',
              },
            },
            {
              label: 'Can Wipe',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                defaultValue: 'false',
                tooltip: 'Should be wipeable?',
              },
            },
            {
              label: 'Can Pause',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should be pausable?',
              },
            },
            {
              label: 'Can Mint',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should be mintable?',
              },
            },
            {
              label: 'Can Burn',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should be burnable?',
              },
            },
            {
              label: 'Can Change Owner',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should the owner be changeable?',
              },
            },
            {
              label: 'Can Add Roles',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Should roles be add-able?',
              },
            },
          ],
        },
      );
      break;
    default:
      break;
  }
  return section;
};

export default createAsset;
