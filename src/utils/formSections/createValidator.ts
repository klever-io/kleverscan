import { ISection } from 'components/Form';

const createValidatorContract = (address = ''): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Name',
        props: {
          tooltip: 'Validator name',
          required: true,
        },
      },
      {
        label: 'Owner Address',
        props: {
          value: address,
          required: true,
        },
      },
      {
        label: 'BLS Public Key',
      },
      {
        label: 'Reward Address',
        props: {
          required: true,
          tooltip:
            'Address that will receive per validated\nblock or transaction',
        },
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
        label: 'Comission',
        props: {
          type: 'number',
          tooltip: 'Validation commission with 2 decimals',
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
          tooltip: 'Any relevant URI for the validator',
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

export default createValidatorContract;
