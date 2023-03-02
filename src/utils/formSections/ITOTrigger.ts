import { ISection } from '@/components/Form';
import {
  defaultLimitPerAddressSection,
  maxAmountSection,
  receiverAddressSection,
  setTimesSection,
  setWhitelistStatusSection,
  statusSection,
  whitelistSection,
  whitelistTimesSection,
} from './common';

const ITOTriggerContract = (type?: number | null, address = ''): ISection[] => {
  const section = [] as ISection[];

  if (isNaN(Number(type)) && type !== null) {
    return [];
  }

  switch (type) {
    case 0: // Set Packs
      break;
    case 1: // Set Status
      section.push(...statusSection());
      break;
    case 2: // Set Receiver Address
      section.push(...receiverAddressSection(address));
      break;
    case 3: // Set Max Amount
      section.push(...maxAmountSection({ required: true }));
      break;
    case 4: // Set Default Limit Per Address
      section.push(...defaultLimitPerAddressSection({ required: true }));
      break;
    case 5: // Set Times
      section.push(...setTimesSection({ required: true }));
      break;
    case 6: // Set Whitelist Status
      section.push(...setWhitelistStatusSection({ required: true }));
      break;
    case 7: // Add Address to Whitelist
      section.push(...whitelistSection({ required: true }));
      break;
    case 8: // Remove Address from Whitelist
      section.push({
        title: 'Whitelist',
        fields: [
          {
            label: 'Whitelist Info',
            props: {
              type: 'struct',
              array: true,
              tooltip: 'Whitelist addresses to be removed',
              innerSection: {
                title: 'Whitelist Info',
                inner: true,
                innerPath: 'whitelistInfo',
                fields: [
                  {
                    label: 'Address',
                    props: {
                      required: true,
                      tooltip: 'Whitelisted address to be removed',
                      span: 2,
                    },
                  },
                ],
              },
            },
          },
        ],
      });
      break;
    case 9: // Update Whitelist Time
      section.push(...whitelistTimesSection({ required: true }));
      break;

    default:
      break;
  }

  return [...section];
};

export default ITOTriggerContract;
