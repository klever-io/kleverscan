import { ISection } from 'components/Form';

export const freezeContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        {
          label: 'AssetID',
          props: {
            tooltip: 'Defaults to KLV',
          }
        },
        {
          label: 'Amount',
          props: {
            type: 'number',
            required: true,
            tooltip: 'Amount to be frozen (with precision)',
          },
        },
      ],
    });

    return section;
};

export const unfreezeContract = (): ISection[] => {
    const section = [] as ISection[];

    section.push({
      fields: [
        {
          label: 'AssetID',
          props: {
            tooltip: 'Unfrozen asset ID, defaults to KLV if empty',
          }
        },
        {
          label: 'BucketID',
          props: {
            required: true,
            tooltip: 'Bucket to be unfrozen',
          },
        },
      ],
    });

    return section;
};
  