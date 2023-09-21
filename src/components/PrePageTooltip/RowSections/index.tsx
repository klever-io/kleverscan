import { Redirect } from '@/assets/icons';
import { getStatusIcon } from '@/assets/status';
import { Loader } from '@/components/Loader/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import {
  IAccountResponse,
  IAssetResponse,
  IRowSection,
  ITransactionResponse,
} from '@/types';
import { ContractsName, ITransferContract } from '@/types/contracts';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions/index';
import { KLV_PRECISION } from '@/utils/globalVariables';
import Link from 'next/link';
import { IoIosInfinite } from 'react-icons/io';
import {
  AssetNameWrapper,
  AssetTypeSpan,
  DateSpan,
  FailSpan,
  HashSpan,
  HoverDiv,
  LogoWrapper,
  RedirectSVG,
  SpanWithIcon,
  SpanWrapper,
  SpanWrapperBottom,
  SuccessSpan,
  TitleSpan,
  TitleWrapper,
  TokenNameSpan,
  TokenTicker,
  TxTypeSpan,
  UnderlineSpan,
} from '../styles';

const getRedirectButton = (path: string) => (
  <Link href={path}>
    <RedirectSVG>
      <Redirect />
    </RedirectSVG>
  </Link>
);

export const TransactionRowSections = (
  res: ITransactionResponse,
  precision: number,
): IRowSection[] => {
  if (res.data || res.error === '') {
    const { transaction } = res.data;

    const getTxStatus = () => {
      if (transaction.status === 'success') {
        const Status = getStatusIcon('success');
        return (
          <SuccessSpan>
            <Status width={50} />
            <span>Success</span>
          </SuccessSpan>
        );
      }
      const Status = getStatusIcon('fail');
      return (
        <FailSpan>
          <Status width={50} />
          <span>Fail</span>
        </FailSpan>
      );
    };

    const date = formatDate(transaction.timestamp);

    const amountOrContractType = () => {
      if (transaction.contract.length > 1) {
        return <SpanWrapper>Multicontract</SpanWrapper>;
      } else if (transaction.contract[0].type === 0) {
        const transferContract = transaction.contract[0]
          .parameter as unknown as ITransferContract;
        return precision ? (
          <TxTypeSpan>
            {toLocaleFixed(
              transferContract.amount / 10 ** precision,
              precision,
            )}{' '}
            {transferContract.assetId || 'KLV'}
          </TxTypeSpan>
        ) : (
          <Loader />
        );
      }
      return (
        <SpanWrapper>
          {ContractsName[transaction.contract[0].typeString]}
        </SpanWrapper>
      );
    };

    const getReceiver = () => {
      const parameter = transaction.contract[0]
        .parameter as unknown as ITransferContract;
      return parameter?.toAddress ? (
        <UnderlineSpan>
          <Link href={`/account/${parameter?.toAddress}`}>
            {parameter?.toAddress}
          </Link>
        </UnderlineSpan>
      ) : (
        <span>--</span>
      );
    };

    return [
      {
        element: (
          <TitleWrapper>
            <TitleSpan>Transaction Summary</TitleSpan>
            {getRedirectButton(`/transaction/${transaction.hash}`)}
          </TitleWrapper>
        ),
        span: 2,
      },
      {
        element: <span>{getTxStatus()}</span>,
        span: 1,
      },
      { element: <DateSpan>{date}</DateSpan>, span: 1 },
      {
        element: (
          <HashSpan>
            <Link href={`/transaction/${transaction.hash}`}>
              {transaction.hash}
            </Link>
          </HashSpan>
        ),
        span: 1,
      },
      { element: amountOrContractType(), span: 1 },
      {
        element: (
          <SpanWrapper>
            From:{' '}
            <UnderlineSpan>
              <Link href={`/account/${transaction.sender}`}>
                {transaction.sender}
              </Link>
            </UnderlineSpan>
          </SpanWrapper>
        ),
        span: 1,
      },
      {
        element: <SpanWrapper>To: {getReceiver()}</SpanWrapper>,
        span: 1,
      },
    ];
  }
  return [
    { element: <TitleSpan>Transaction Summary</TitleSpan>, span: 2 },
    { element: <span>{res.error}</span>, span: 2 },
  ];
};

export const AssetRowSections = (
  res: IAssetResponse,
  precision: number,
): IRowSection[] => {
  if (res.data || res.error === '') {
    const { asset } = res.data;

    return [
      {
        element: (
          <TitleWrapper>
            <TitleSpan>Token Summary</TitleSpan>
            {getRedirectButton(`/asset/${asset.assetId}`)}
          </TitleWrapper>
        ),
        span: 2,
      },
      {
        element: (
          <HoverDiv>
            <Link href={`/asset/${asset.assetId}`}>
              <LogoWrapper>
                <AssetLogo
                  logo={asset?.logo || ''}
                  ticker={asset?.ticker || ''}
                  name={asset?.name || ''}
                  verified={asset?.verified}
                  invertColors={true}
                />
                <AssetNameWrapper>
                  <TokenTicker>{asset.ticker}</TokenTicker>
                  <TokenNameSpan>{asset.name}</TokenNameSpan>
                </AssetNameWrapper>
              </LogoWrapper>
            </Link>
          </HoverDiv>
        ),
        span: 1,
      },
      { element: <AssetTypeSpan>{asset.assetType}</AssetTypeSpan>, span: 1 },
      {
        element: (
          <>
            <SpanWrapperBottom>Max. Supply:</SpanWrapperBottom>
            {asset.maxSupply ? (
              <TxTypeSpan>
                {toLocaleFixed(asset.maxSupply / 10 ** precision, precision)}
              </TxTypeSpan>
            ) : (
              <SpanWithIcon>
                <IoIosInfinite />
              </SpanWithIcon>
            )}
          </>
        ),
        span: 1,
      },
      {
        element: (
          <>
            <SpanWrapperBottom> Circulating Supply:</SpanWrapperBottom>
            <TxTypeSpan>
              {toLocaleFixed(
                asset.circulatingSupply / 10 ** precision,
                precision,
              )}
            </TxTypeSpan>
          </>
        ),
        span: 1,
      },
    ];
  }
  return [
    { element: <TitleSpan>Token Summary</TitleSpan>, span: 2 },
    { element: <span>{res.error}</span>, span: 2 },
  ];
};

export const AccountRowSections = (
  res: IAccountResponse,
  precision: number,
): IRowSection[] => {
  if (res.data || res.error === '') {
    const { account } = res.data;
    return [
      {
        element: (
          <TitleWrapper>
            <TitleSpan>Account Resume</TitleSpan>
            {getRedirectButton(`/account/${account.address}`)}
          </TitleWrapper>
        ),
        span: 2,
      },
      {
        element: (
          <HashSpan style={{ maxWidth: '20rem' }}>
            <Link href={`/account/${account.address}`}>{account.address}</Link>
          </HashSpan>
        ),
        span: 2,
      },
      {
        element: (
          <HoverDiv>
            <Link href={'/asset/klv'}>
              <LogoWrapper>
                <AssetLogo
                  logo={'/assets/klv-logo.png'}
                  ticker={'KLV'}
                  name={'Klever'}
                  verified={true}
                  invertColors={true}
                />
                <AssetNameWrapper>
                  <TokenTicker>{'KLV'}</TokenTicker>
                  <TokenNameSpan>{'Klever'}</TokenNameSpan>
                </AssetNameWrapper>
              </LogoWrapper>
            </Link>
          </HoverDiv>
        ),
        span: 1,
      },
      {
        element: (
          <>
            <SpanWrapperBottom> KLV Balance:</SpanWrapperBottom>
            <TxTypeSpan>
              {toLocaleFixed(
                account.balance / 10 ** KLV_PRECISION,
                KLV_PRECISION,
              )}
            </TxTypeSpan>
          </>
        ),
        span: 1,
      },
      {
        element: (
          <SpanWrapperBottom>
            {`Account total assets: ${
              Object.keys(account.assets)?.length || 0
            }`}
          </SpanWrapperBottom>
        ),
        span: 1,
      },
    ];
  }

  return [
    { element: <TitleSpan>Account Summary</TitleSpan>, span: 2 },
    { element: <span>{res.error}</span>, span: 2 },
  ];
};

export const BlockRowSections = (
  res: IAccountResponse,
  precision: number,
): IRowSection[] => {
  if (res.data || res.error === '') {
    const { block } = res.data;
    const date = formatDate(block.timestamp);
    return [
      {
        element: (
          <TitleWrapper>
            <TitleSpan>Block Summary</TitleSpan>
            {getRedirectButton(`/block/${block.nonce}`)}
          </TitleWrapper>
        ),
        span: 2,
      },
      {
        element: (
          <SpanWrapper>
            Nonce:{' '}
            <HashSpan>
              <Link href={`/block/${block.nonce}`}>{`#${block.nonce}`}</Link>
            </HashSpan>
          </SpanWrapper>
        ),
        span: 1,
      },
      {
        element: <DateSpan>{date}</DateSpan>,
        span: 1,
      },
      {
        element: (
          <SpanWrapper>
            Miner:{' '}
            <UnderlineSpan>
              {' '}
              <Link href={`account/${block.producerOwnerAddress}`}>
                {block.producerName || block.producerOwnerAddress}
              </Link>
            </UnderlineSpan>
          </SpanWrapper>
        ),
        span: 1,
      },
      {
        element: (
          <HoverDiv>
            <Link href={`/block/${block.nonce}`}>
              <LogoWrapper>
                <AssetLogo
                  logo={block?.producerLogo || '--'}
                  ticker={''}
                  name={block?.producerName || ''}
                  invertColors={true}
                />
              </LogoWrapper>
            </Link>
          </HoverDiv>
        ),
        span: 1,
      },
      {
        element: <SpanWrapper>Epoch: {`${block.epoch}`}</SpanWrapper>,
        span: 1,
      },
      {
        element: <SpanWrapper>Transactions: {`${block.txCount}`}</SpanWrapper>,
        span: 1,
      },
    ];
  }
  return [
    { element: <TitleSpan>Block Summary</TitleSpan>, span: 2 },
    { element: <span>{res.error}</span>, span: 2 },
  ];
};
