import { ISection } from 'components/Form';

export const delegateContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Receiver', props: { required: true } },
      {
        label: 'BucketID',
        props: { required: true },
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
        label: 'BucketID',
        props: { required: true },
      },
    ],
  });

  return section;
}
  