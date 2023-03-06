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

const configITOContract = (address = ''): ISection[] => {
  const sections = [] as ISection[];

  const mainSection = {
    fields: [
      ...receiverAddressSection(address)[0].fields,
      ...setTimesSection()[0].fields,
      ...maxAmountSection()[0].fields,
      ...statusSection()[0].fields,
    ],
  };
  sections.push(mainSection);

  const whitelistConfigSection = {
    fields: [
      ...whitelistTimesSection()[0].fields,
      ...defaultLimitPerAddressSection()[0].fields,
      ...setWhitelistStatusSection()[0].fields,
    ],
  };
  sections.push(whitelistConfigSection);

  sections.push(...whitelistSection());
  return sections;
};

export default configITOContract;
