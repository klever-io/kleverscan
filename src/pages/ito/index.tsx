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
import { IITOResponse, IParsedITO, IRowSection } from '@/types';
import { IPackInfo } from '@/types/contracts';
import { formatAmount } from '@/utils/formatFunctions';
import { parseITOs } from '@/utils/parseValues';
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

const ITOsPage: React.FC = () => {
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

  const requestITOSQuery = async (
    page: number,
    limit: number,
  ): Promise<IITOResponse> => {
    const dataITOs = await requestITOs(router, page, limit);
    await parseITOs(dataITOs.data.itos);
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

    const sections = [
      {
        element: (
          <Link href={`/asset/${assetId}?reference=ito`} key={assetId}>
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
          <Link href={`/asset/${assetId}?reference=ito`} key={name}>
            <a style={{ overflow: 'hidden' }}>{name}</a>
          </Link>
        ),
        span: 1,
      },
      {
        element: (
          <ContainerAssetId>
            <Link href={`/asset/${assetId}?reference=ito`} key={assetId}>
              {assetId}
            </Link>
            <Copy info="Asset ID" data={assetId} svgSize={18} />
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
          <ParticipateButton
            onClick={() => {
              setITO(asset);
              setOpenParticipateModal(true);
            }}
            key={name}
          >
            Participate
          </ParticipateButton>
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

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['itos'],
    nextI18nextConfig,
  );

  return { props };
};

export default ITOsPage;
