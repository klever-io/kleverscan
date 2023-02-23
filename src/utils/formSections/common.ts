import { IFormField, ISection } from 'components/Form';

export const RoyaltiesSection = (
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
      props: {
        type: 'number',
        tooltip:
          'Percentage of the currency that will be charged from an ITO Buy',
      },
    },
    {
      label: 'ITO Fixed',
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
        tooltip: 'Transfer fee details for non-fungible tokens',
      },
    });
    section[0].fields.push({
      label: 'Market Percentage',
      props: {
        type: 'number',
        tooltip:
          'Market percentage fee details for non-fungible tokens (precision 2)',
      },
    });
    section[0].fields.push({
      label: 'Market Fixed',
      props: {
        type: 'number',
        tooltip: 'Market fixed fee details for non-fungible tokens',
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
              label: 'Percent Transfer Percentage',
              props: {
                type: 'number',
                tooltip:
                  'Percentage that the given address will receive from transfer percentage (precision 2)',
              },
            },
            {
              label: 'Percent Market Percentage',
              props: {
                type: 'number',
                tooltip:
                  'Percentage that the given address will receive from market percentage (precision 2)',
              },
            },
            {
              label: 'Percent Market Fixed',
              props: {
                type: 'number',
                tooltip:
                  'Percentage that the given address will receive from market fixed (precision 2)',
              },
            },
            {
              label: 'Percent ITO Percentage',
              props: {
                type: 'number',
                tooltip:
                  'Percentage that the given address will receive from market percentage (precision 2)',
              },
            },
            {
              label: 'Percent ITO Fixed',
              props: {
                type: 'number',
                tooltip:
                  'Percentage that the given address will receive from market fixed (precision 2)',
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
                          'Percentage that the given address will receive from transfer percentage (precision 2)',
                      },
                    },
                    {
                      label: 'Percent ITO Percentage',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from market percentage (precision 2)',
                      },
                    },
                    {
                      label: 'Percent ITO Fixed',
                      props: {
                        type: 'number',
                        tooltip:
                          'Percentage that the given address will receive from market fixed (precision 2)',
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
