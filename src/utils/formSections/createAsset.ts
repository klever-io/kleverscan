import { ISection } from 'components/Form';
import { RoyaltiesSection } from './common';

const createAsset = (type: string, address = ''): ISection[] => {
  const section = [] as ISection[];

  switch (type) {
    case 'Token':
      section.push(
        {
          fields: [
            {
              label: 'Name',
              props: {
                required: true,
              },
            },
            {
              label: 'Ticker',
              props: {
                required: true,
                tooltip: 'Capital letters only',
              },
            },
            {
              label: 'Owner Address',
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
                tooltip: 'Asset precision (0 to 8)',
              },
            },
            {
              label: 'Initial Supply',
              props: {
                type: 'number',
                tooltip: 'Initial minted supply',
              },
            },
            {
              label: 'Max Supply',
              props: {
                type: 'number',
                tooltip: 'Maximum supply of the asset',
              },
            },
            {
              label: 'Logo',
              props: {
                span: 2,
                tooltip: 'Logo URI',
              },
            },
          ],
        },
        {
          title: 'Uris',
          tooltip: 'Any useful URIs related to the token',
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
                      },
                    },
                    {
                      label: 'Address',
                      props: {
                        tooltip: 'URI address. Ex: "http://bar.com"',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        ...RoyaltiesSection(address, false),
        {
          title: 'Staking',
          fields: [
            {
              label: 'Type',
              props: {
                type: 'checkbox',
                toggleOptions: ['APR', 'FPR'],
                defaultValue: 0,
                disabled: false,
              },
            },
            {
              label: 'APR',
              props: {
                type: 'number',
                tooltip: 'Annual percentage rate',
              },
            },
            {
              label: 'Min Epochs To Claim',
              props: {
                type: 'number',
                tooltip:
                  'Minimum amount of epochs to claim rewards ( each epoch has 6h )',
              },
            },
            {
              label: 'Min Epochs To Unstake',
              props: {
                type: 'number',
                tooltip:
                  'Minimum amount of epochs to unstake tokens ( each epoch has 6h )',
              },
            },
            {
              label: 'Min Epochs To Withdraw',
              props: {
                type: 'number',
                tooltip:
                  'Minimum amount of epochs to withdraw tokens after unstaking ( each epoch has 6h )',
              },
            },
          ],
        },
        {
          title: 'Roles',
          tooltip: 'Set permissions to specific address',
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
          tooltip: 'Choose the properties the new token will have',
          fields: [
            {
              label: 'Freeze',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Lock up tokens to generate rewards',
              },
            },
            {
              label: 'Wipe',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                defaultValue: 'false',
                tooltip:
                  'Burn the tokens from a suspicious account and send them back to owner',
              },
            },
            {
              label: 'Pause',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Stop transactions',
              },
            },
            {
              label: 'Mint',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Create new tokens using a mint process',
              },
            },
            {
              label: 'Burn',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Eliminate part of the token circulation',
              },
            },
            {
              label: 'Change Owner',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Gives the option of changing the asset owner',
              },
            },
            {
              label: 'Add Roles',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip:
                  'Defines whether roles can be applied to addresses that\nweren’t defined during the token creation process',
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
            { label: 'Name', props: { required: true } },
            {
              label: 'Ticker',
              props: { required: true, tooltip: 'Capital letters only' },
            },
            {
              label: 'Owner Address',
              props: {
                required: true,
                defaultValue: address,
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
                tooltip: 'Logo URI',
              },
            },
          ],
        },
        {
          title: 'Uris',
          tooltip: 'Any useful URIs related to the token',
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
                      },
                    },
                    {
                      label: 'Address',
                      props: {
                        tooltip: 'URI address. Ex: "http://bar.com"',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        ...RoyaltiesSection(address, type === 'NFT'),
        {
          title: 'Roles',
          tooltip: 'Set permissions to a specific address',
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
          tooltip: 'Choose the properties the new NFT will have',
          fields: [
            {
              label: 'Freeze',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Lock up tokens to generate rewards',
              },
            },
            {
              label: 'Wipe',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                defaultValue: 'false',
              },
            },
            {
              label: 'Pause',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
              },
            },
            {
              label: 'Mint',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Create new tokens using a mint process',
              },
            },
            {
              label: 'Burn',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Eliminate part of the token circulation',
              },
            },
            {
              label: 'Change Owner',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip: 'Gives the option of changing the NFT owner',
              },
            },
            {
              label: 'Add Roles',
              props: {
                type: 'checkbox',
                toggleOptions: ['No', 'Yes'],
                bool: true,
                tooltip:
                  'Defines whether roles can be applied to addresses that \nweren’t defined during the NFT creation process',
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
