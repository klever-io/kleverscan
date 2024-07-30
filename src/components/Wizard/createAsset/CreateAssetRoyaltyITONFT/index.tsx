import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { ButtonsComponent } from '../ButtonsComponent';
import { ErrorMessage, GenericCardContainer, GenericInput } from '../styles';

// TODO -> Check translation for the NFT
export const CreateAssetRoyaltyITONFT: React.FC<PropsWithChildren<any>> = ({
  buttonsProps,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const ticker = watch('ticker');
  let errorTransferFixed = null;
  let errorMarketPercentage = null;
  let errorMarketFixed = null;
  let errorItoPercentage = null;
  let errorItoFixed = null;

  try {
    errorTransferFixed = eval(`errors?.royalties.percentTransferFixed`);
    errorMarketPercentage = eval(`errors?.royalties.percentMarketPercentage`);
    errorMarketFixed = eval(`errors?.royalties.marketFixed`);
    errorItoPercentage = eval(`errors?.royalties.itoPercentage`);
    errorItoFixed = eval(`errors?.royalties.itoFixed`);
  } catch {
    errorTransferFixed = null;
    errorMarketPercentage = null;
    errorMarketFixed = null;
    errorItoPercentage = null;
    errorItoFixed = null;
  }

  return (
    <GenericCardContainer>
      <div>
        <p>Advanced Option</p>
        <p>STEP 3/5</p>
      </div>
      <div>
        <p>Set the values for the {ticker} ITO&apos;s royalties</p>
        <p>
          Now you will choose the value of the royalties that the address
          selected will receive.
        </p>
        <GenericInput
          error={errorTransferFixed}
          type="number"
          autoFocus={true}
          placeholder="Transfer Fixed"
          {...register('royalties.transferFixed', {
            valueAsNumber: true,
          })}
        />
        <p>Fixed transfer fee for non-fungible tokens (in KLV)</p>
        {errorTransferFixed && (
          <ErrorMessage>{errorTransferFixed?.message}</ErrorMessage>
        )}

        <GenericInput
          error={errorMarketPercentage}
          type="number"
          placeholder="Market Percentage"
          {...register('royalties.marketPercentage', {
            min: { value: 0, message: 'Min value is 0' },
            max: { value: 100, message: 'Max value is 100' },
            valueAsNumber: true,
          })}
        />
        <p>
          Market percentage fee for non-fungible tokens of the currency (
          precision 2, 100 = 100% )
        </p>
        {errorMarketPercentage && (
          <ErrorMessage>{errorMarketPercentage?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorMarketFixed}
          type="number"
          placeholder="Market Fixed"
          {...register('royalties.marketFixed', {
            valueAsNumber: true,
          })}
        />
        <p>Market fixed fee details for non-fungible tokens (in KLV)</p>
        {errorMarketFixed && (
          <ErrorMessage>{errorMarketFixed?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorItoPercentage}
          type="number"
          placeholder="ITO Percentage"
          {...register('royalties.itoPercentage', {
            min: { value: 0, message: 'Min value is 0' },
            max: { value: 100, message: 'Max value is 100' },
            valueAsNumber: true,
          })}
        />
        <p>
          {' '}
          Percentage of the currency that will be charged from an ITO Buy - (
          precision 2, 100 = 100% )
        </p>
        {errorItoPercentage && (
          <ErrorMessage>{errorItoPercentage?.message}</ErrorMessage>
        )}
        <GenericInput
          error={errorItoFixed}
          type="number"
          placeholder="ITO Fixed"
          {...register('royalties.itoFixed', {
            valueAsNumber: true,
          })}
        />
        <p>Fixed amount of the currency that will be charged from an ITO Buy</p>
        {errorItoFixed && <ErrorMessage>{errorItoFixed?.message}</ErrorMessage>}
      </div>

      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
