import { PropsWithChildren } from 'react';
import { ParticipateModal } from '@/components/Asset/AssetSummary/ParticipateModal';
import { HashComponent } from '@/components/Contract';
import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/ITOTable';
import { LaunchPadBanner } from '@/components/LaunchPad/Banner';
import { LaunchPadFAQ } from '@/components/LaunchPad/FAQ';
import { LaunchPadFAQCards } from '@/components/LaunchPad/FAQCards';
import { LearnBanner } from '@/components/LaunchPad/LearnBanner';
import { WalletBanner } from '@/components/LaunchPad/WalletBanner';
import AssetLogo from '@/components/Logo/AssetLogo';
import { useParticipate } from '@/contexts/participate';
import { requestITOs } from '@/services/requests/ito';
import { CenteredRow, DoubleRow } from '@/styles/common';
import { IITOResponse, IParsedITO, IRowSection } from '@/types';
import { IPackInfo } from '@/types/contracts';
import { formatAmount } from '@/utils/formatFunctions';
import { parseITOs } from '@/utils/parseValues';
import { ContainerAssetId } from '@/views/assets';
import { ProjectName } from '@/views/ito/style';
import {
  ITOContainer,
  MainContainer,
  ParticipateButton,
  TableContainer,
  TableHeader,
  TableTitle,
} from '@/views/launchpad';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';
import { IoIosInfinite } from 'react-icons/io';
import nextI18nextConfig from '../../../next-i18next.config';

export function getBestKLVRate(packData: IPackInfo[]): number | undefined {
  let bestKLVRate: number | undefined = undefined;
  if (packData) {
    packData.forEach(pack => {
      if (pack.key === 'KLV') {
        pack.packs.forEach(p => {
          const rate = p.price;
          if (!bestKLVRate || rate < bestKLVRate) {
            bestKLVRate = rate;
          }
        });
      }
    });
  }
  return bestKLVRate;
}

export const requestITOSQuery = async (
  page: number,
  limit: number,
  router: NextRouter,
): Promise<IITOResponse> => {
  const dataITOs = await requestITOs(router, page, limit);
  await parseITOs(dataITOs.data.itos);
  return dataITOs;
};

export const getITOrowSections =
  (
    setITO: (asset: IParsedITO) => void,
    setOpenParticipateModal: (open: boolean) => void,
    reference?: string,
  ) =>
  (asset: IParsedITO): IRowSection[] => {
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

    const bestKLVRate = getBestKLVRate(packData);

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

    const sections: IRowSection[] = [
      {
        element: props => (
          <Link
            href={`/asset/${assetId}${reference ? `?reference=${reference}` : ''}`}
          >
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
        element: props => (
          <Link
            href={`/asset/${assetId}${reference ? `?reference=${reference}` : ''}`}
          >
            <a style={{ overflow: 'hidden' }}>{name}</a>
          </Link>
        ),
        span: 1,
      },
      {
        element: props => (
          <ContainerAssetId>
            <Link
              href={`/asset/${assetId}${reference ? `?reference=${reference}` : ''}`}
            >
              {assetId}
            </Link>
            <Copy info="Asset ID" data={assetId} svgSize={18} />
          </ContainerAssetId>
        ),
        span: 1,
      },
      {
        element: props => (
          <span>
            {bestKLVRate || '- -'}
            {bestKLVRate && ' KLV'}
          </span>
        ),
        span: 1,
      },
      { element: props => <span>{assetType}</span>, span: 1 },
      {
        element: props => (
          <strong>
            {renderSoldAmount()} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: props => (
          <strong>
            {renderTotalAmount()} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: props => <span>{access}</span>,
        span: 1,
      },
      {
        element: props => (
          <ParticipateButton
            onClick={() => {
              setITO(asset);
              setOpenParticipateModal(true);
            }}
          >
            Participate
          </ParticipateButton>
        ),
        span: 2,
      },
    ];

    return sections;
  };

export const getITOTabletRowSections =
  (
    setITO: (asset: IParsedITO) => void,
    setOpenParticipateModal: (open: boolean) => void,
    reference?: string,
  ) =>
  (asset: IParsedITO): IRowSection[] => {
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

    const bestKLVRate = getBestKLVRate(packData);

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

    const sections: IRowSection[] = [
      {
        element: props => (
          <CenteredRow>
            <Link
              href={`/asset/${assetId}${reference ? `?reference=${reference}` : ''}`}
            >
              <a>
                <AssetLogo
                  logo={logo}
                  ticker={ticker}
                  name={name}
                  verified={verified}
                  size={36}
                />
              </a>
            </Link>
            <DoubleRow>
              <Link
                href={`/asset/${assetId}${reference ? `?reference=${reference}` : ''}`}
              >
                <ProjectName style={{ overflow: 'hidden' }}>{name}</ProjectName>
              </Link>
              <ContainerAssetId>
                <Link
                  href={`/asset/${assetId}${reference ? `?reference=${reference}` : ''}`}
                >
                  {assetId}
                </Link>
                <Copy info="Asset ID" data={assetId} svgSize={18} />
              </ContainerAssetId>
            </DoubleRow>
          </CenteredRow>
        ),
        span: 2,
      },
      { element: props => <span>{assetType}</span>, span: 1 },
      {
        element: props => <span>{access}</span>,
        span: 1,
      },
      {
        element: props => (
          <DoubleRow>
            <span>
              {bestKLVRate || '- -'}
              {bestKLVRate && ' KLV'}
            </span>
            <br />
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <DoubleRow>
            <strong>
              {renderSoldAmount()} {ticker}
            </strong>
            <strong>
              {renderTotalAmount()} {ticker}
            </strong>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <ParticipateButton
            onClick={() => {
              setITO(asset);
              setOpenParticipateModal(true);
            }}
          >
            Participate
          </ParticipateButton>
        ),
        span: 2,
      },
    ];

    return sections;
  };

export const ITOheaders = [
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
export const ITOTabletheaders = [
  '',
  'Type',
  'Access',
  'Best KLV Rate',
  'Sold/Total',
  '',
];

const ITOsPage: React.FC<PropsWithChildren> = () => {
  const [ITO, setITO] = useState<IParsedITO | null>(null);
  const {
    openParticipateModal,
    setOpenParticipateModal,
    txHash,
    setTxHash,
    setLoading,
  } = useParticipate();
  const { t } = useTranslation('itos');
  const router = useRouter();

  const tableProps: ITable = {
    rowSections: getITOrowSections(setITO, setOpenParticipateModal, 'ito'),
    header: ITOheaders,
    type: 'launchPad',
    request: (page, limit) => requestITOSQuery(page, limit, router),
    dataName: 'itos',
    scrollUp: false,
    showLimit: false,
  };

  const hashProps = {
    hash: txHash,
    setHash: setTxHash,
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
          {txHash && <HashComponent {...hashProps} />}

          <Table {...tableProps} />
        </TableContainer>
        <LearnBanner />
        <WalletBanner />
        <LaunchPadFAQ />
      </ITOContainer>

      {ITO &&
        ReactDOM.createPortal(
          <ParticipateModal
            key={ITO.assetId}
            isOpenParticipateModal={openParticipateModal}
            setOpenParticipateModal={setOpenParticipateModal}
            ITO={ITO}
            setTxHash={setTxHash}
            setLoading={setLoading}
          />,
          window.document.body,
        )}
    </MainContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['itos'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default ITOsPage;
