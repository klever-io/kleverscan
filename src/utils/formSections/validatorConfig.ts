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
      },
      {
        label: 'BLS Public Key',
        props: {
          tooltip: 'BLS Public Key',
        }
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
          tooltip: 'Validation commission (precision 2)',
        },
      },
      {
        label: 'Max Delegation Amount',
        props: {
          type: 'number',
        },
      },
      {
        label: 'Logo',
        props: {
          tooltip: 'Logo URI',
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
    ]
  });

  return section;
};
  
export default validatorConfigContract;
  