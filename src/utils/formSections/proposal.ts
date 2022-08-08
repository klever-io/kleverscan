import { IParamList } from '@/types/index';
import { ISection } from 'components/Form';

const proposalContract = (paramsList?: IParamList[]): ISection[] => {
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
                  label: 'Parameter Key',
                  props: {
                    type: 'dropdown',
                    options: paramsList,
                    tooltip: 'Parameter key',
                  }
                },
                {
                  label: 'Parameter Value',
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