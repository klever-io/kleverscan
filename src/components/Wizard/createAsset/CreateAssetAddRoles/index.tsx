import { WizardLeftArrow, WizardPlusSquare } from '@/assets/icons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IAssetInformations } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  BorderedButton,
  ButtonsContainer,
  CheckBoxInput,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
  IconWizardInfoSquare,
  InfoCard,
  RolesCheckboxContainer,
  RolesContainer,
  UriButtonsContainer,
  WizardButton,
  WizardRightArrowSVG,
} from '../styles';

export const CreateAssetAddRoles: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({ informations: { assetType }, handleStep, t }) => {
  const [addRole, setAddRole] = useState(false);
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const ticker = watch('ticker');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles',
  });

  const assetText = assetType === 0 ? 'Token' : 'NFT';

  const [currentIndex, setCurrentIndex] = useState(0);

  const buttonsProps = {
    handleStep,
    next: true,
  };

  let error = errors?.roles?.[currentIndex]?.address;

  if (addRole) {
    buttonsProps.next = !!(!error && Object.entries(error || {}).length === 0);
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
  }, [fields, append]);

  return !addRole ? (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>{t('wizards:common.advancedOptions.roles.roles').toUpperCase()}</p>
      </div>
      <div>
        <p>
          {t('wizards:common.advancedOptions.roles.enableRoles', {
            ticker,
            assetText,
          })}
        </p>
        <ButtonsContainer>
          <WizardButton infoStep centered onClick={() => setAddRole(true)}>
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
          {t('wizards:common.advancedOptions.roles.whatIs')}
        </InfoCard>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.roles.setPermission')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} noNextButton />
    </GenericCardContainer>
  ) : (
    <GenericCardContainer>
      <div>
        <p> {t('wizards:common.advancedOptions.roles.roles')}</p>
        <p key={fields.length}>
          {t('wizards:common.advancedOptions.roles.role')} {currentIndex + 1}/
          {fields.length}
        </p>
      </div>
      <div key={currentIndex}>
        <p>{t('wizards:common.advancedOptions.roles.enterAddress')}</p>
        <GenericInput
          error={error}
          type="text"
          placeholder="KDA address"
          {...register(`roles.${currentIndex}.address`, {
            required: {
              value: true,
              message: t('wizards:common.errorMessage.required'),
            },
            minLength: {
              value: 62,
              message: t('wizards:common.errorMessage.charactersField', {
                number: 62,
              }),
            },
            maxLength: {
              value: 62,
              message: t('wizards:common.errorMessage.charactersField', {
                number: 62,
              }),
            },
          })}
        />
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}

        <RolesContainer>
          <RolesCheckboxContainer>
            <CheckBoxInput {...register(`roles.${currentIndex}.hasRoleMint`)} />
            {t('wizards:common.advancedOptions.roles.allowedToMintCoins')}
          </RolesCheckboxContainer>
          <RolesCheckboxContainer>
            <CheckBoxInput
              {...register(`roles.${currentIndex}.hasRoleSetITOPrices`)}
            />
            {t('wizards:common.advancedOptions.roles.allowedToSetPrice')}
          </RolesCheckboxContainer>
        </RolesContainer>
        <GenericInfoCard>
          {t('wizards:common.advancedOptions.roles.tooltip', { assetText })}
        </GenericInfoCard>
        <BorderedButton
          type="button"
          onClick={() => remove(currentIndex)}
          isHidden={fields.length <= 1}
          alignSelf
          fullWidth
        >
          {t('wizards:common.advancedOptions.roles.remove')}
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

            <span> {t('wizards:common.previous')}</span>
          </BorderedButton>
          <BorderedButton
            type="button"
            onClick={handleNextIndex}
            isHidden={fields.length <= 1}
          >
            <span> {t('wizards:common.next')}</span>
            <WizardRightArrowSVG />
          </BorderedButton>
        </div>
        <BorderedButton
          type="button"
          onClick={() => {
            append({});
            setCurrentIndex(fields.length);
          }}
        >
          <span> {t('wizards:common.advancedOptions.roles.addAnother')}</span>
          <WizardPlusSquare />
        </BorderedButton>
        <ButtonsComponent buttonsProps={buttonsProps} />
      </UriButtonsContainer>
    </GenericCardContainer>
  );
};
