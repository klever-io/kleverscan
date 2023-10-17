import {
  ITooltipDoubleTxsData,
  ITooltipPriceData,
  ITooltipTxsData,
} from '@/pages/charts';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { TooltipContainer } from './Area/styles';

export const PriceTooltip = ({
  payload,
  label,
  active,
}: ITooltipPriceData): JSX.Element | null => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <p>{`price: ${toLocaleFixed(payload[0]?.value, 6)} U$`}</p>
      </TooltipContainer>
    );
  }

  return null;
};

export const TxsTooltip = ({
  payload,
  label,
  active,
}: ITooltipTxsData): JSX.Element | null => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <p>{`${payload[0]?.payload.date}: ${payload[0]?.value}`}</p>
      </TooltipContainer>
    );
  }

  return null;
};

export const DoubleTxsTooltip = ({
  payload,
  label,
  active,
}: ITooltipDoubleTxsData): JSX.Element | null => {
  if (active && payload && payload.length) {
    const nowIsBigger =
      payload[0]?.payload.valueNow - payload[0]?.payload.valuePast > 0;

    const Now = (
      <p style={{ color: '#AA33B5' }}>{`${
        payload[0]?.payload.dateNow
      }: ${toLocaleFixed(payload[0]?.payload.valueNow, 0)}`}</p>
    );

    const Past = (
      <p>{`${payload[0]?.payload.datePast}: ${toLocaleFixed(
        payload[0]?.payload.valuePast,
        0,
      )}`}</p>
    );
    return (
      <TooltipContainer>
        {nowIsBigger ? (
          <>
            {Now}
            {Past}
          </>
        ) : (
          <>
            {Past}
            {Now}
          </>
        )}
      </TooltipContainer>
    );
  }

  return null;
};
