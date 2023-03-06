import { ISection } from '@/components/Form';

const withdrawContract = (type?: number | null): ISection[] => {
  const section = [] as ISection[];

  if (isNaN(Number(type)) && type !== null) {
    return [];
  }

  section.push({
    fields: [],
  });

  switch (type) {
    case 0:
      break;
    case 1:
      section[0].fields.push(
        {
          label: 'Amount',
          props: {
            type: 'number',
            tooltip: 'Amount to be withdrawn from pool',
          },
        },
        {
          label: 'Currency Id',
          props: {
            type: 'string',
            tooltip: 'Asset to be withdrawn from pool',
          },
        },
      );
      break;
  }

  return section;
};

export default withdrawContract;
