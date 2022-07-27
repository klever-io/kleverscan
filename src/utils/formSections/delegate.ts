import { ISection } from 'components/Form';

export const delegateContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Receiver',
        props: {
          required: true,
          tooltip: 'Address to be delegated to',
        },
      },
      {
        label: 'BucketId',
        props: {
          required: true,
          tooltip: 'Bucket to be delegated',
        },
      },
    ],
  });

  return section;
};

export const undelegateContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'BucketId',
        props: {
          required: true,
          tooltip: 'Bucket ID to be undelegated',
        },
      },
    ],
  });

  return section;
}
  