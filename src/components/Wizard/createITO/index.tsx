import { WizardLeftArrow } from '@/assets/icons';
import Select from '@/components/Contract/Select';
import { statusOptions } from '@/components/TransactionForms/CustomForms/ConfigITO';
import { useExtension } from '@/contexts/extension';
import { getAsset } from '@/services/requests/asset';
import { IAsset } from '@/types';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import Image from 'next/legacy/image';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IoArrowForward } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { IWizardComponents, infinitySymbol } from '../createAsset';
import { ButtonsComponent } from '../createAsset/ButtonsComponent';
import {
  BackArrowSpan,
  BorderedButton,
  ButtonsContainer,
  ConfirmCardBasics,
  ConfirmCardBasisInfo,
  ConfirmCardImage,
  ErrorInputContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
  IconWizardInfoSquare,
  InfoCard,
  ReviewContainer,
  UriButtonsContainer,
  WizardButton,
  WizardRightArrowSVG,
} from '../createAsset/styles';

export interface IAssetITOInformations extends IWizardComponents {
  informations: {
    title?: string;
    description?: string;
    tooltip?: string;
    kleverTip?: string;
    transactionCost?: string;
    timeEstimated?: string;
    assetType?: number;
    additionalFields?: boolean;
    currentStep?: string;
    formValue?: string;
    nameTime?: string;
  };
}

statusOptions;
export interface IStatusITO {
  [key: string]: number | string;
}

export const propertiesCommonDefaultValuesITO = {
  collection: '',
  receiverAddress: '',
  startTime: '',
  endTime: '',
  maxAmount: 0,
  status: 1,
  startTimeStartNow: false,
};

const infinity = '\u221e';
