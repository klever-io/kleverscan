import { ISection } from 'components/Form';

const proposalContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push(
    {
      fields: [
        {
          label: 'Description',
          props: { required: true },
        },
        {
          label: 'Epochs Duration',
          props: { required: true },
        },
        {
          label: 'Parameters',
          props: {
            type: 'struct',
            array: true,
            innerSection: {
              title: 'Parameters',
              inner: true,
              innerPath: 'parameters',
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
  );

  return section;
};

export default proposalContract; 