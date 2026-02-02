import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Copy from '@/components/Copy';
import { useTheme } from '@/contexts/theme/index';
import { hexToString } from '@/utils/convertString';
import { parseJson } from '@/utils/parseValues';
import {
  ButtonExpand,
  Row as DetailRow,
  DivDataJson,
  ExpandCenteredRow,
  IconsWrapper,
} from '@/views/transactions/detail';

interface Props {
  data: string[] | undefined;
  totalContracts?: number;
}

interface IRawTxTheme {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base0A: string;
  base0B: string;
  base0C: string;
  base0D: string;
  base0E: string;
  base0F: string;
}

export const getRawTxTheme = (isDarkTheme = false): IRawTxTheme => {
  return {
    base00: '',
    base01: '#ddd',
    base02: '#ddd',
    base03: '',
    base04: '',
    base05: isDarkTheme ? 'white' : 'black',
    base06: isDarkTheme ? 'white' : 'black',
    base07: isDarkTheme ? 'white' : 'black',
    base08: isDarkTheme ? 'white' : 'black',
    base09: '',
    base0A: '',
    base0B: '',
    base0C: '',
    base0D: '',
    base0E: '',
    base0F: '',
  };
};

const MetadataRenderer: React.FC<Props> = ({ data, totalContracts = 0 }) => {
  const initializeExpandData = () => {
    if (data && data.length > 0) {
      const expandArray: boolean[] = [];
      data.forEach(() => {
        expandArray.push(false);
      });
      return expandArray;
    }
    return [];
  };

  const [expandData, setExpandData] = useState(initializeExpandData());
  const { isDarkTheme } = useTheme();

  const ReactJson = dynamic(
    () => import('react-json-view').then(mod => mod.default),
    { ssr: false },
  );

  const updateExpandArray = (index: number) => {
    const newArray = [...expandData];
    newArray[index] = !expandData[index];
    setExpandData(newArray);
  };

  const processMetadata = (metadataString: string, index: number) => {
    const formatData = (hexData: any) => <span>{hexToString(hexData)}</span>;

    if (expandData[index]) {
      try {
        const jsonData = JSON.parse(parseJson(hexToString(metadataString)));
        if (jsonData && typeof jsonData === 'object') {
          return (
            <DivDataJson>
              <ReactJson
                src={jsonData}
                name={false}
                displayObjectSize={false}
                enableClipboard={true}
                displayDataTypes={false}
                theme={getRawTxTheme(isDarkTheme)}
              />
            </DivDataJson>
          );
        }
        return formatData(metadataString);
      } catch (error) {
        return formatData(metadataString);
      }
    }
    return <span>{hexToString(metadataString)}</span>;
  };

  const renderMetadata = (index: number): React.ReactElement | null => {
    if (!data || (data && !data[index])) return null;
    return (
      <DetailRow>
        <span>
          <strong>Metadata</strong>
        </span>
        <ExpandCenteredRow openJson={expandData[index]}>
          {processMetadata(data[index], index)}
        </ExpandCenteredRow>
        <IconsWrapper>
          <ButtonExpand onClick={() => updateExpandArray(index)}>
            {expandData[index] ? 'Hide' : 'Expand'}
          </ButtonExpand>
          <Copy data={hexToString(data[index])} info="Data" />
        </IconsWrapper>
      </DetailRow>
    );
  };

  return null;
};

export default MetadataRenderer;

export const useMetadataRenderer = (data: string[] | undefined) => {
  const initializeExpandData = () => {
    if (data && data.length > 0) {
      const expandArray: boolean[] = [];
      data.forEach(() => {
        expandArray.push(false);
      });
      return expandArray;
    }
    return [];
  };

  const [expandData, setExpandData] = useState(initializeExpandData());
  const { isDarkTheme } = useTheme();

  const ReactJson = dynamic(
    () => import('react-json-view').then(mod => mod.default),
    { ssr: false },
  );

  const updateExpandArray = (index: number) => {
    const newArray = [...expandData];
    newArray[index] = !expandData[index];
    setExpandData(newArray);
  };

  const processMetadata = (metadataString: string, index: number) => {
    const formatData = (hexData: any) => <span>{hexToString(hexData)}</span>;

    if (expandData[index]) {
      try {
        const jsonData = JSON.parse(parseJson(hexToString(metadataString)));
        if (jsonData && typeof jsonData === 'object') {
          return (
            <DivDataJson>
              <ReactJson
                src={jsonData}
                name={false}
                displayObjectSize={false}
                enableClipboard={true}
                displayDataTypes={false}
                theme={getRawTxTheme(isDarkTheme)}
              />
            </DivDataJson>
          );
        }
        return formatData(metadataString);
      } catch (error) {
        return formatData(metadataString);
      }
    }
    return <span>{hexToString(metadataString)}</span>;
  };

  const renderMetadata = (index: number): React.ReactElement | null => {
    if (!data || (data && !data[index])) return null;
    return (
      <DetailRow>
        <span>
          <strong>Metadata</strong>
        </span>
        <ExpandCenteredRow openJson={expandData[index]}>
          {processMetadata(data[index], index)}
        </ExpandCenteredRow>
        <IconsWrapper>
          <ButtonExpand onClick={() => updateExpandArray(index)}>
            {expandData[index] ? 'Hide' : 'Expand'}
          </ButtonExpand>
          <Copy data={hexToString(data[index])} info="Data" />
        </IconsWrapper>
      </DetailRow>
    );
  };

  return { renderMetadata };
};
