import { WizardLeftArrow } from '@/assets/icons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlusSquare } from 'react-icons/fi';
import { IAssetInformations } from '..';
import { validateUrl } from '../../utils';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  BorderedButton,
  ButtonsContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
  IconWizardInfoSquare,
  InfoCard,
  UriButtonsContainer,
  WizardButton,
  WizardRightArrowSVG,
} from '../styles';

export const URIsSection: React.FC<PropsWithChildren<IAssetInformations>> = ({
  informations: { assetType },
  handleStep,
  t,
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'uris',
  });

  const assetText = assetType === 0 ? 'token' : 'NFT';

  const [addUri, setAddUri] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  let errorLabel = null;
  let errorUri = null;

  const buttonsProps = {
    handleStep,
    next: true,
  };

  try {
    errorLabel = eval(`errors?.uris[${currentIndex}]?.label`);
    errorUri = eval(`errors?.uris[${currentIndex}]?.uri`);
  } catch {
    errorLabel = null;
    errorUri = null;
  }

  if (addUri) {
    buttonsProps.next = !!(!errorLabel && !errorUri);
  }

  const handleNextIndex = () => {
    if (currentIndex < fields.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousIndex = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  useEffect(() => {
    if (fields.length === 0) append({});
  }, []);

  return !addUri ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>{t('wizards:common.advancedOptions.URI.URI')}</p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.URI.doYouWantAdd', {
            assetText,
          })}
        </p>
        <ButtonsContainer columnDirection>
          <WizardButton
            infoStep
            centered
            onClick={() => {
              setAddUri(true);
            }}
          >
            {t('common:Statements.Yes')}
          </WizardButton>
          <WizardButton
            infoStep
            secondary
            centered
            onClick={() => handleStep(prev => prev + 1)}
          >
            {t('common:Statements.No')}
          </WizardButton>
        </ButtonsContainer>
        <InfoCard>
          <IconWizardInfoSquare />
          {t('wizards:common.advancedOptions.URI.whatIsAnURI')}?
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.URI.tooltip')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.URI.URI')}</p>
        <p key={fields.length}>
          {t('wizards:common.advancedOptions.URI.URI')} {currentIndex + 1}/
          {fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>{t('wizards:common.advancedOptions.URI.fillTokenURIs')}</p>
        <GenericInput
          error={errorLabel}
          type="text"
          {...register(`uris[${currentIndex}].label`, {
            required: {
              value: true,
              message: t('wizards:common.errorMessage.required'),
            },
          })}
          placeholder="URI label"
        />
        <p>{t('wizards:common.advancedOptions.URI.labelURL')}</p>
        {errorLabel && <ErrorMessage>{errorLabel?.message}</ErrorMessage>}
        <GenericInput
          error={errorUri}
          type="text"
          {...register(`uris[${currentIndex}].uri`, {
            required: {
              value: true,
              message: t('wizards:common.errorMessage.required'),
            },
            validate: uriValue => {
              if (uriValue && !validateUrl(uriValue, false)) {
                return `${t('wizards:common.errorMessage.validURI')}`;
              }
              return true;
            },
          })}
          placeholder="URI here"
        />
        <p>{t('wizards:common.advancedOptions.URI.exampleURI')}</p>
        {errorUri && <ErrorMessage>{errorUri?.message}</ErrorMessage>}
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          fullWidth
        >
          {t('wizards:common.advancedOptions.URI.removeURI')}
        </BorderedButton>
      </div>
      <UriButtonsContainer>
        <div>
          <BorderedButton
            type="button"
            onClick={handlePreviousIndex}
            isHidden={fields.length <= 1}
          >
            <WizardLeftArrow />

            <span>{t('wizards:common.previous')}</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span>{t('wizards:common.next')}</span>
            <WizardRightArrowSVG />
          </BorderedButton>
        </div>
        <BorderedButton
          type="button"
          onClick={() => {
            append({});
            setCurrentIndex(fields.length);
          }}
          fullWidth
        >
          <span>{t('wizards:common.advancedOptions.URI.addURI')}</span>
          <FiPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};
