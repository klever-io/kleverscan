import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/ITOTable';
import { LaunchPadBanner } from '@/components/LaunchPad/Banner';
import { LaunchPadFAQ } from '@/components/LaunchPad/FAQ';
import { LaunchPadFAQCards } from '@/components/LaunchPad/FAQCards';
import { LearnBanner } from '@/components/LaunchPad/LearnBanner';
import { WalletBanner } from '@/components/LaunchPad/WalletBanner';
import AssetLogo from '@/components/Logo/AssetLogo';
import {
  parseITOsRequest,
  requestAssetsList,
  requestITOs,
} from '@/services/requests/ito';
import { IITOResponse, IParsedITO, IRowSection } from '@/types';
import { IPackInfo } from '@/types/contracts';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { ContainerAssetId } from '@/views/assets';
import {
  ITOContainer,
  MainContainer,
  ParticipateButton,
  TableContainer,
  TableHeader,
  TableTitle,
} from '@/views/launchpad';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { IoIosInfinite } from 'react-icons/io';
import nextI18nextConfig from '../../../next-i18next.config';

export function getBestKLVRate(
  packData: IPackInfo[],
  precision: number,
): number | undefined {
  let bestKLVRate: number | undefined = undefined;
  if (packData) {
    packData.forEach(pack => {
      if (pack.key === 'KLV') {
        pack.packs.forEach(p => {
          const rate =
            (p.price * 10 ** precision) / (p.amount * 10 ** KLV_PRECISION);
          if (!bestKLVRate || rate < bestKLVRate) {
            bestKLVRate = rate;
          }
        });
      }
    });
  }
  return bestKLVRate;
}

const ITOsPage: React.FC = () => {
  const { t } = useTranslation('itos');
  const router = useRouter();

  const requestITOSQuery = async (
    page: number,
    limit: number,
  ): Promise<IITOResponse> => {
    const dataITOs = await requestITOs(router, page, limit);
    const assets = await requestAssetsList(dataITOs);
    await parseITOsRequest(dataITOs, assets);
    return dataITOs;
  };

  const rowSections = (asset: IParsedITO): IRowSection[] => {
    const {
      ticker,
      name,
      logo,
      assetId,
      assetType,
      precision,
      verified,
      maxAmount,
      mintedAmount,
      packData,
      startTime,
      endTime,
      whitelistStartTime,
      whitelistEndTime,
    } = asset;

    const bestKLVRate = getBestKLVRate(packData, precision);

    const access = Date.now() < whitelistEndTime ? 'Whitelist Only' : 'Public';

    const renderTotalAmount = (): ReactNode => {
      return (
        <strong>
          {!(maxAmount === 0 || Number.isNaN(maxAmount)) ? (
            formatAmount(maxAmount / 10 ** precision)
          ) : (
            <IoIosInfinite />
          )}
        </strong>
      );
    };
    const renderSoldAmount = (): ReactNode => {
      return (
        <strong>
          {mintedAmount && mintedAmount !== 0
            ? formatAmount(mintedAmount / 10 ** precision)
            : 0}
        </strong>
      );
    };

    const sections = [
      {
        element: (
          <Link href={`/asset/${assetId}`} key={assetId}>
            <a>
              <AssetLogo
                logo={logo}
                ticker={ticker}
                name={name}
                verified={verified}
              />
            </a>
          </Link>
        ),
        span: 1,
      },

      {
        element: (
          <Link href={`/asset/${assetId}`} key={name}>
            <a style={{ overflow: 'hidden' }}>
              <p>{name}</p>
            </a>
          </Link>
        ),
        span: 1,
      },
      {
        element: (
          <ContainerAssetId>
            <Link href={`/asset/${assetId}`} key={assetId}>
              {assetId}
            </Link>
            <Copy info="Asset ID" data={assetId} />
          </ContainerAssetId>
        ),
        span: 1,
      },

      {
        element: (
          <span key={bestKLVRate}>
            {bestKLVRate || '- -'}
            {bestKLVRate && ' KLV'}
          </span>
        ),
        span: 1,
      },
      { element: <span key={assetType}>{assetType}</span>, span: 1 },
      {
        element: (
          <strong key={maxAmount}>
            {renderSoldAmount()} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={maxAmount}>
            {renderTotalAmount()} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: <span key={access}>{access}</span>,
        span: 1,
      },
      {
        element: (
          <Link key={assetId} href={`/asset/${assetId}`}>
            <ParticipateButton>Participate</ParticipateButton>
          </Link>
        ),
        span: 1,
      },
    ];

    return sections;
  };

  const header = [
    '',
    'Project Name',
    'ID',
    'Best KLV Rate',
    'Type',
    'Sold',
    'Total',
    'Access',
    '',
  ];

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'launchPad',
    request: (page, limit) => requestITOSQuery(page, limit),
    dataName: 'itos',
    scrollUp: false,
    showLimit: false,
  };

  return (
    <MainContainer>
      <ITOContainer>
        <LaunchPadBanner />
        <LaunchPadFAQCards />
        <TableContainer>
          <TableHeader>
            <TableTitle>Live Projects</TableTitle>
          </TableHeader>
          <Table {...tableProps} />
        </TableContainer>
        <LearnBanner />
        <WalletBanner />
        <LaunchPadFAQ />
      </ITOContainer>
    </MainContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['itos'],
    nextI18nextConfig,
  );

  return { props };
};

export default ITOsPage;
