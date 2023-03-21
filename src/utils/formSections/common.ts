import { IFormField, ISection } from '@/components/Form';

// Asset + Asset Trigger Sections
export const royaltiesSection = (
  address?: string,
  isNFT?: boolean,
): ISection[] => {
  const section: ISection[] = [];
  section.push({
    title: 'Royalties',
    fields: [
      {
        label: 'Address',
        props: {
          required: true,
          tooltip: 'Royalty receiver address',
          defaultValue: address || '',
          span: 2,
        },
      },
    ],
  });

  const ITOFields: IFormField[] = [
    {
      label: 'ITO Percentage',
      objectName: 'itoPercentage',
      props: {
        type: 'number',
        tooltip:
          'Percentage of the currency that will be charged from an ITO Buy',
        maxDecimals: 2,
      },
    },
    {
      label: 'ITO Fixed',
      objectName: 'itoFixed',
      props: {
        type: 'number',
        tooltip:
          'Fixed amount of the currency that will be charged from an ITO Buy',
      },
    },
  ];

  if (isNFT) {
    section[0].fields.push({
      label: 'Transfer Fixed',
      props: {
        type: 'number',
        tooltip: 'Fixed transfer fee for non-fungible tokens (in KLV)',
      },
    });
    section[0].fields.push({
      label: 'Market Percentage',
      props: {
        type: 'number',
        tooltip: 'Market percentage fee for non-fungible tokens (in KLV)',
        maxDecimals: 2,
      },
    });
    section[0].fields.push({
      label: 'Market Fixed',
      props: {
        type: 'number',
        tooltip: 'Market fixed fee details for non-fungible tokens (in KLV)',
      },
    });
    section[0].fields.splice(4, 0, ...ITOFields);

    section[0].fields.push({
      label: 'Split Royalties',
      props: {
        type: 'struct',
        array: true,
        tooltip: 'How the royalties are split',
        innerSection: {
          title: 'Royalty Split Info',
          inner: true,
          innerPath: 'royalties.splitRoyalties',
          fields: [
            {
              label: 'Address',
              props: {
                required: true,
                tooltip: 'Royalty receiver address',
                defaultValue: address || '',
              },
            },
            {
              label: 'Split Royalty Values',
              props: {
                type: 'struct',
                innerSection: {
                  inner: true,
                  innerPath: 'royalties.splitRoyalties.splitRoyaltyValues',
                  fields: [
                    {
                      label: 'Percent Transfer Fixed',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from "transfer percentage" fee',
                        maxDecimals: 2,
                      },
                    },
                    {
                      label: 'Percent Market Percentage',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from "market percentage" fee',
                        maxDecimals: 2,
                      },
                    },
                    {
                      label: 'Percent Market Fixed',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from "market fixed" fee',
                        maxDecimals: 2,
                      },
                    },
                    {
                      label: 'Percent ITO Percentage',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from "ITO percentage" fee',
                        maxDecimals: 2,
                      },
                    },
                    {
                      label: 'Percent ITO Fixed',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from "ITO fixed" fee',
                        maxDecimals: 2,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    });
  } else {
    section[0].fields.splice(1, 0, ...ITOFields);

    section[0].fields.push({
      label: 'Transfer Percentage',
      props: {
        type: 'struct',
        array: true,
        tooltip:
          'How much to be charged with fees in a transfer, the cost can increase or decrease depending on the amount of the transfer',
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
                tooltip: 'Fee, in percentage',
                maxDecimals: 2,
              },
            },
          ],
        },
      },
    });
    section[0].fields.push({
      label: 'Split Royalties',
      props: {
        type: 'struct',
        array: true,
        tooltip: 'How the royalties are split',
        innerSection: {
          title: 'Royalty Split Info',
          inner: true,
          innerPath: 'royalties.splitRoyalties',
          fields: [
            {
              label: 'Address',
              props: {
                required: true,
                tooltip: 'Royalty receiver address',
                defaultValue: address || '',
              },
            },
            {
              label: 'Split Royalty Values',
              props: {
                type: 'struct',
                innerSection: {
                  inner: true,
                  innerPath: 'royalties.splitRoyalties.splitRoyaltyValues',
                  fields: [
                    {
                      label: 'Percent Transfer Percentage',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from "transfer percentage" fee',
                        maxDecimals: 2,
                      },
                    },
                    {
                      label: 'Percent ITO Percentage',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from "ITO percentage" fee',
                        maxDecimals: 2,
                      },
                    },
                    {
                      label: 'Percent ITO Fixed',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from "ITO fixed" fee',
                        maxDecimals: 2,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    });
  }

  return section;
};

export const stakingSection = (): ISection[] => {
  const section: ISection[] = [];
  section.push({
    title: 'Staking',
    fields: [
      {
        label: 'interestType',
        props: {
          type: 'checkbox',
          toggleOptions: ['APR', 'FPR'],
          defaultChecked: false,
          defaultValue: 0,
        },
      },
      {
        label: 'APR',
        props: {
          type: 'number',
          tooltip: 'Annual percentage rate, in percentage, 100 = 100%',
          maxDecimals: 2,
          min: 0,
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
  });
  return section;
};

// ITOConfig + ITOTrigger Sections
export const receiverAddressSection = (address: string): ISection[] => {
  const section: ISection[] = [];
  section.push({
    fields: [
      {
        label: 'Receiver Address',
        props: {
          defaultValue: address,
          required: true,
          tooltip: 'Address of the main royalty receiver',
          span: 2,
        },
      },
    ],
  });
  return section;
};

export const statusSection = (
  { required } = {
    required: true,
  },
): ISection[] => {
  const section: ISection[] = [];
  section.push({
    fields: [
      {
        label: 'Status',
        props: {
          required,
          tooltip: 'Sets the status of the ITO',
          type: 'dropdown',
          options: [
            {
              label: 'ActiveITO (1)',
              value: 1,
            },
            {
              label: 'PausedITO (2)',
              value: 2,
            },
          ],
        },
      },
    ],
  });
  return section;
};

export const maxAmountSection = (
  { required } = {
    required: false,
  },
): ISection[] => {
  const section: ISection[] = [];
  section.push({
    fields: [
      {
        label: 'Max Amount',
        props: {
          required,
          tooltip: 'Max amount of tokens to be sold in the ITO',
        },
      },
    ],
  });
  return section;
};

export const defaultLimitPerAddressSection = (
  { required } = {
    required: false,
  },
): ISection[] => {
  const section: ISection[] = [];
  section.push({
    fields: [
      {
        label: 'Default Limit Per Address',
        props: {
          required,
          tooltip:
            'Default limit of the KDA that can be acquired per address during the whitelist',
        },
      },
    ],
  });
  return section;
};

export const setTimesSection = (
  { required } = {
    required: false,
  },
): ISection[] => {
  const section: ISection[] = [];
  section.push({
    fields: [
      {
        label: 'Start Time',
        props: {
          required,
          tooltip: 'ITO start time',
          type: 'datetime-local',
        },
      },
      {
        label: 'End Time',
        props: {
          required,
          tooltip: 'ITO end time',
          type: 'datetime-local',
        },
      },
    ],
  });
  return section;
};

export const setWhitelistStatusSection = (
  { required } = {
    required: false,
  },
): ISection[] => {
  const section: ISection[] = [];
  section.push({
    fields: [
      {
        label: 'Whitelist Status',
        props: {
          required,
          tooltip: 'Whitelist status',
          type: 'dropdown',
          options: [
            {
              label: 'ActiveITO (1)',
              value: 1,
            },
            {
              label: 'PausedITO (2)',
              value: 2,
            },
          ],
        },
      },
    ],
  });
  return section;
};

export const whitelistSection = (
  { required } = {
    required: false,
  },
): ISection[] => {
  const section: ISection[] = [];
  section.push({
    title: 'Whitelist',
    fields: [
      {
        label: 'Whitelist Info',
        props: {
          type: 'struct',
          array: true,
          tooltip: 'Whitelist Addresses Info',
          innerSection: {
            title: 'Whitelist Info',
            inner: true,
            innerPath: 'whitelistInfo',
            fields: [
              {
                label: 'Address',
                props: {
                  required,
                  tooltip: 'Whitelisted address',
                },
              },
              {
                label: 'Limit',
                props: {
                  type: 'number',
                  tooltip:
                    'Max amount of tokens that can be purchased by the address',
                },
              },
            ],
          },
        },
      },
    ],
  });
  return section;
};

export const whitelistTimesSection = (
  { required } = {
    required: false,
  },
): ISection[] => {
  const section: ISection[] = [];
  section.push({
    fields: [
      {
        label: 'Whitelist Start Time',
        props: {
          required,
          tooltip: 'Whitelist start time',
          type: 'datetime-local',
        },
      },
      {
        label: 'Whitelist End Time',
        props: {
          required,
          tooltip: 'Whitelist end time',
          type: 'datetime-local',
        },
      },
    ],
  });
  return section;
};
