export const mockBuySection = [
  {
    fields: [
      {
        label: 'Order ID',
        props: {
          required: true,
          tooltip: 'ITOBuy: ITO Asset ID, MarketBuy: order ID',
        },
      },
      {
        label: 'Currency Id',
        props: {
          required: true,
          tooltip: 'ID of the trade currency',
        },
      },
      {
        label: 'Amount',
        props: {
          type: 'number',
          required: true,
          tooltip:
            'ITOBuy: Amount to be bought, MarkeyBuy: item price / amount bidden (check precision)',
        },
      },
    ],
  },
];

export const mockCreateAssetSection = [
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
          defaultValue:
            'klv10s3j6u593tc483qyt52xx4x2m5yrha37qdshkjhntyzngq2g99dqaunaeh',
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
  {
    title: 'Royalties',
    tooltip: 'Fees for transferring and buying the token in the marketplace',
    fields: [
      {
        label: 'Address',
        props: {
          required: true,
          span: 2,
          tooltip: 'Royalty receiver address',
        },
      },
      {
        label: 'Transfer Percentage',
        props: {
          type: 'struct',
          array: true,
          tooltip: 'How much to be charged with fees',
          innerSection: {
            title: 'Royalty Info',
            inner: true,
            innerPath: 'royalties.transferPercentage',
            fields: [
              {
                label: 'Amount',
                props: {
                  type: 'number',
                  tooltip: 'Max amount for that percentage',
                },
              },
              {
                label: 'Percentage',
                props: {
                  type: 'number',
                  tooltip: 'Fee % (precision 2)',
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
          tooltip: 'Annual percentage rate',
        },
      },
      {
        label: 'Min Epochs To Claim',
        props: {
          type: 'number',
          tooltip: 'Minimum amount of epochs to claim rewards',
        },
      },
      {
        label: 'Min Epochs To Unstake',
        props: {
          type: 'number',
          tooltip: 'Minimum amount of epochs to unstake tokens',
        },
      },
      {
        label: 'Min Epochs To Withdraw',
        props: {
          type: 'number',
          tooltip:
            'Minimum amount of epochs to withdraw tokens after unstaking',
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
    title: 'BLSPublicKey',
    tooltip:
      'Small test for unCapitalize func to blsPubKey - ( This is "Properties", originally )',
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
];

export const mockAssetTriggerTx = [
  {
    title: 'Roles',
    tooltip: 'Set permissions to specific address',
    fields: [
      {
        label: 'Role',
        props: {
          type: 'struct',
          innerSection: {
            title: 'Roles',
            inner: true,
            innerPath: 'role',
            fields: [
              {
                label: 'Address',
                props: {
                  span: 2,
                  tooltip: 'Address of another wallet',
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
];
export const mockTransferContract = [
  {
    fields: [
      {
        title: 'BLSPublicKey',
        label: 'Amount',
        props: {
          type: 'number',
          required: true,
          tooltip: 'Amount to be sent',
        },
      },
      {
        label: 'Receiver Address',
      },
    ],
  },
];
