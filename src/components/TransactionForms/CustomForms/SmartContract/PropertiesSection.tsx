import { useMulticontract } from '@/contexts/contract/multicontract';
import FormInput from '../../FormInput';
import {
  InfoIcon,
  TooltipContainer,
  TooltipContent,
} from '../../FormInput/styles';
import { FormSection, SectionTitle } from '../../styles';
import { smartContractTooltips as tooltip } from '../utils/tooltips';

const bitValuesBytes0_1 = {
  payable: 2,
  payableBySC: 4,
};

const bitValuesBytes2_3 = {
  upgradable: 1,
  readable: 4,
};

const toggleOptions: [string, string] = ['False', 'True'];

interface IProperties {
  propertiesString: string;
  setPropertiesString: (propertiesString: string) => void;
}

export const PropertiesSection: React.FC<IProperties> = ({
  propertiesString,
  setPropertiesString,
}) => {
  const { metadata, setMetadata } = useMulticontract();

  const bitsOfByte0_1 = propertiesString
    .split('')
    .reverse()
    .join('')
    .slice(0, 8);
  const bitsOfByte2_3 = propertiesString
    .split('')
    .reverse()
    .join('')
    .slice(8, 16);

  const isUpgradable =
    bitsOfByte2_3[Math.log2(bitValuesBytes2_3.upgradable)] === '1';
  const isReadable =
    bitsOfByte2_3[Math.log2(bitValuesBytes2_3.readable)] === '1';
  const isPayable = bitsOfByte0_1[Math.log2(bitValuesBytes0_1.payable)] === '1';
  const isPayableBySC =
    bitsOfByte0_1[Math.log2(bitValuesBytes0_1.payableBySC)] === '1';

  const togglePropery = (property: string) => {
    const newProperties = propertiesString.split('').reverse();

    const byte = property === 'upgradable' || property === 'readable' ? 2 : 0;

    if (byte === 0) {
      const bit = Math.log2(bitValuesBytes0_1[property]);
      newProperties[bit] = newProperties[bit] === '0' ? '1' : '0';
    }

    if (byte === 2) {
      const bit = Math.log2(bitValuesBytes2_3[property]) + 8;
      newProperties[bit] = newProperties[bit] === '0' ? '1' : '0';
    }

    newProperties.reverse();

    const newPropertiesHex = parseInt(newProperties.join(''), 2)
      .toString(16)
      .padStart(4, '0');

    const newMetadataProperties =
      metadata.split('@').slice(0, 2).join('@') + '@' + newPropertiesHex;

    setMetadata(newMetadataProperties);

    setPropertiesString(newProperties.join(''));
  };

  return (
    <FormSection inner>
      <SectionTitle>
        <span>Properties</span>
        <TooltipContainer>
          <InfoIcon size={13} />
          <TooltipContent>
            <span>{tooltip.properties.title}</span>
          </TooltipContent>
        </TooltipContainer>
      </SectionTitle>
      <FormInput
        title="Upgradable"
        type="checkbox"
        checked={isUpgradable}
        toggleOptions={toggleOptions}
        tooltip={tooltip.properties.upgradable}
        onChange={() => togglePropery('upgradable')}
        required
      />
      <FormInput
        title="Readable"
        type="checkbox"
        checked={isReadable}
        toggleOptions={toggleOptions}
        tooltip={tooltip.properties.readable}
        onChange={() => togglePropery('readable')}
        required
      />
      <FormInput
        title="Payable"
        type="checkbox"
        checked={isPayable}
        toggleOptions={toggleOptions}
        tooltip={tooltip.properties.payable}
        onChange={() => togglePropery('payable')}
        required
      />
      <FormInput
        title="PayableBySC"
        type="checkbox"
        checked={isPayableBySC}
        toggleOptions={toggleOptions}
        tooltip={tooltip.properties.payableBySC}
        onChange={() => togglePropery('payableBySC')}
        required
      />
    </FormSection>
  );
};
