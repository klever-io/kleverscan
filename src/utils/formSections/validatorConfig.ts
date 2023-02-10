import { ISection } from 'components/Form';

const validatorConfigContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Name',
        props: {
          tooltip: 'Validator name',
        },
      },
      {
        label: 'Reward Address',
        props: {
          tooltip:
            'Address that will receive per validated block or transaction',
        },
      },
      {
        label: 'BLS Public Key',
      },
      {
        label: 'Can Delegate',
        props: {
          type: 'checkbox',
          toggleOptions: ['No', 'Yes'],
          bool: true,
          tooltip: 'Permission to delegate',
        },
      },
      {
        label: 'Commission',
        props: {
          type: 'number',
          tooltip: 'Validation commission with 2 decimals',
          maxDecimals: 2,
        },
      },
      {
        label: 'Max Delegation Amount',
        props: {
          type: 'number',
          tooltip: 'Limit of delegation a validator accepts',
        },
      },
      {
        label: 'Logo',
        props: {
          tooltip: 'To be shown on the Explorer details page',
        },
      },
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
  });

  return section;
};

export default validatorConfigContract;
