import { ISection } from 'components/Form';

const proposalContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push(
    {
      fields: [
        {
          label: 'Description',
          props: {
            tooltip: 'Proposal description',
          }
        },
        {
          label: 'Epochs Duration',
          props: {
            required: true,
            tooltip: 'Proposal epochs duration',
          },
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
                  props: {
                    tooltip: 'Parameter key',
                  }
                },
                {
                  label: 'Address',
                  props: {
                    tooltip: 'Parameter address',
                  }
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