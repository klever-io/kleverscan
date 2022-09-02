import { ISection } from 'components/Form';

const assetTriggerContract = (type?: number | null): ISection[] => {
  const address = sessionStorage.getItem('walletAddress') || '';
  let section = [] as ISection[];

  if (isNaN(Number(type)) && type !== null) {
    return [];
  }

  section.push({
    fields: [],
  });

  switch (type) {
    case 1:
      section[0].fields.push({
        label: 'Amount',
        props: {
          type: 'number',
          tooltip: 'Amount',
        },
      });
      break;

    case 3:
    case 4:
    case 9:
      section = [];
      break;

    case 6:
      section = [];
      section.push({
        title: 'Role',
        tooltip: 'Set permissions to specific address',
        fields: [
          {
            label: 'Role',
            props: {
              type: 'struct',
              innerSection: {
                title: 'Role',
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
      });
      break;

    case 8:
      section[0].fields.push(
        {
          label: 'Mime',
          props: { tooltip: 'The nature and format of the metadata' },
        },
        {
          label: 'Receiver',
          props: {
            defaultValue: address,
            span: 2,
            tooltip: 'Target address for transaction',
          },
        },
        {
          label: 'Data',
          props: {
            type: 'textarea',
            span: 2,
            tooltip: 'Metadata',
          },
        },
      );
      break;

    case 10:
      section[0].fields.push({
        label: 'Logo',
        props: {
          tooltip: 'Logo image URL',
        },
      });
      break;

    case 11:
      section = [];
      section.push({
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
                    props: { tooltip: 'Uri identifier' },
                  },
                  {
                    label: 'Address',
                    props: { tooltip: 'Uri address' },
                  },
                ],
              },
            },
          },
        ],
      });
      break;

    case 5:
    case 7:
    case 12:
      section[0].fields.push(
        ...[
          {
            label: 'Receiver',
            props: {
              defaultValue: address,
              tooltip: 'Target address for transaction',
            },
          },
        ],
      );
      break;

    case 13:
      section = [];
      section.push({
        title: 'Staking',
        fields: [
          {
            label: 'Type',
            props: {
              type: 'checkbox',
              toggleOptions: ['APR', 'FPR'],
              defaultValue: 0,
              disabled: true,
              tooltip: '0: APR, 1: FPR',
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
      });
      break;

    default:
      section[0].fields.push(
        ...[
          {
            label: 'Receiver',
            props: {
              defaultValue: address,
              tooltip: 'Target address for transaction',
            },
          },
          {
            label: 'Amount',
            props: {
              type: 'number',
              tooltip: 'Amount',
            },
          },
        ],
      );

      break;
  }

  return [...section];
};

export default assetTriggerContract;
