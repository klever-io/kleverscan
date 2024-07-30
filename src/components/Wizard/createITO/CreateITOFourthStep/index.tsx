import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetITOInformations } from '..';
import { ButtonsComponent } from '../../createAsset/ButtonsComponent';
import {
  ConfigITOStartTime,
  ErrorInputContainer,
  ErrorMessage,
  GenericCardContainer,
  GenericInfoCard,
  GenericInput,
} from '../../createAsset/styles';

export const CreateITOFourthStep: React.FC<
  PropsWithChildren<IAssetITOInformations>
> = ({ informations: { currentStep, title, description }, handleStep, t }) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const handlerStartTime = (e: { target: { checked: boolean } }) => {
    setValue('startTimeStartNow', e.target.checked);
  };

  const collection = watch('collection');
  const watchStartTime = watch('startTime');
  const watchStartTimeNow = watch('startTimeStartNow');
  let errorStartTime = null;
  let errorEndTime = null;
  try {
    errorStartTime = eval(`errors?.startTime`);
    errorEndTime = eval(`errors?.endTime`);
  } catch {
    errorStartTime = null;
  }
  const buttonsProps = {
    handleStep,
    next: !!!errorEndTime,
  };

  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:createITO.steps.setUpITO').toUpperCase()}</p>
        <p>
          {' '}
          {t('wizards:common.step')} {currentStep}
        </p>
      </div>
      <div>
        <p>{t('wizards:createITO.steps.durationITO', { collection })}</p>
        <p>{description}</p>
        <ConfigITOStartTime>
          {t('wizards:createITO.steps.startTime')}
          <span>
            {t('wizards:createITO.steps.startTimeRightNow')}
            <input type="checkbox" onChange={handlerStartTime} />
          </span>
        </ConfigITOStartTime>
        <ErrorInputContainer>
          <GenericInput
            error={errorStartTime}
            type="datetime-local"
            autoFocus={true}
            {...register('startTime')}
            disabled={watchStartTimeNow}
          />

          {errorStartTime && (
            <ErrorMessage>{errorStartTime?.message}</ErrorMessage>
          )}
          <p>{t('wizards:createITO.steps.endTime')}</p>
          <GenericInput
            error={errorEndTime}
            type="datetime-local"
            {...register('endTime', {
              validate: endTime => {
                const startTime = new Date(watchStartTime);
                const end = new Date(endTime);
                if (!end) {
                  return true;
                }
                if (end <= startTime) {
                  return 'End Time must be greater than Start Time';
                }
                return true;
              },
            })}
          />
          {errorEndTime && <ErrorMessage>{errorEndTime?.message}</ErrorMessage>}
        </ErrorInputContainer>
        <GenericInfoCard>
          Klever Tip: {t('wizards:createITO.steps.tooltipTimeITO')}
        </GenericInfoCard>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
