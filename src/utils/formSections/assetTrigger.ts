import { ICollectionList } from '@/types';
import { ISection } from 'components/Form';
import { RoyaltiesSection } from './common';

const assetTriggerContract = (
  type?: number | null,
  collection?: ICollectionList,
  address = '',
): ISection[] => {
  let section = [] as ISection[];

  if (isNaN(Number(type)) && type !== null) {
    return [];
  }

  const isNFT = (collection && collection.isNFT) || false;

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
                    props: { tooltip: 'Uri identifier ( Ex: "foo" )' },
                  },
                  {
                    label: 'Address',
                    props: { tooltip: 'Uri address ( Ex: "http://bar.com" )' },
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
              tooltip: 'Anual Percentage Rate',
            },
          },
          {
            label: 'Min Epochs To Claim',
            props: {
              type: 'number',
              tooltip: 'Minimum epochs to claim rewards ( each epoch has 6h )',
            },
          },
          {
            label: 'Min Epochs To Unstake',
            props: {
              type: 'number',
              tooltip: 'Minimum epochs to unstake ( each epoch has 6h )',
            },
          },
          {
            label: 'Min Epochs To Withdraw',
            props: {
              type: 'number',
              tooltip:
                'Minimum epochs to withdraw after unstake ( each epoch has 6h )',
            },
          },
        ],
      });
      break;

    case 14:
      section = [];
      section.push(...RoyaltiesSection(address, isNFT));
      break;
    case 15:
      section = [];
      section.push({
        title: 'KDA Pool',
        objectName: 'kdaPool',
        fields: [
          {
            label: 'KDA',
            props: {
              tooltip: 'Target Asset',
            },
          },
          {
            label: 'Admin Address',
          },
          {
            label: 'Fixed Ratio for KLV',
            objectName: 'fRatioKLV',
            props: {
              type: 'number',
              tooltip: 'Fixed ratio for KLV',
            },
          },
          {
            label: 'Fixed Ratio for KDA',
            objectName: 'fRatioKDA',
            props: {
              type: 'number',
              tooltip: 'Fixed ratio for KDA',
            },
          },
          {
            label: 'Active',
            props: {
              type: 'checkbox',
              toggleOptions: ['No', 'Yes'],
              bool: true,
              tooltip: '"Yes" if the pooling should be active',
            },
          },
        ],
      });
      break;
    case 16:
    case 17:
      section = [];
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
