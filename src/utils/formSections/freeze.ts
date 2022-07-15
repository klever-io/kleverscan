import { ISection } from 'components/Form';

export const freezeContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        { label: 'AssetID' },
        {
          label: 'Amount',
          props: { type: 'number', required: true },
        },
      ],
    });

    return section;
};

export const unfreezeContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        { label: 'AssetID' },
        {
          label: 'BucketID',
          props: { required: true },
        },
      ],
    });

    return section;
};
  