import { ISection } from 'components/Form';

const validatorConfigContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    title: 'Config',
    fields: [
      {
        label: 'Config',
        props: {
          type: 'struct',
          array: false,
          innerSection: {
            title: 'Config',
            inner: true,
            innerPath: 'config',
            fields: [
              {
                label: 'BLS Public Key',
                props: {
                  span: 2,
                },
              },
              {
                label: 'Reward Address',
                props: {
                  span: 2,
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
                  span: 2,
                  type: 'number',
                  tooltip: 'Validation commission (precision 2)',
                },
              },
              {
                label: 'Max Delegation Amount',
                props: {
                  span: 2,
                  type: 'number',
                },
              },
              {
                label: 'Logo',
                props: {
                  span: 2,
                  tooltip: 'Logo URI',
                },
              },
              {
                label: 'Name',
                props: {
                  span: 2,
                  tooltip: 'Validator name',
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
          },
        },
      },
    ],
  });

  return section;
};
  
export default validatorConfigContract;
  