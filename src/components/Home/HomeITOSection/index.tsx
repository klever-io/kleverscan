import { PurpleArrowRight } from '@/assets/icons';
import { ParticipateModal } from '@/components/Asset/AssetSummary/ParticipateModal';
import { HashComponent } from '@/components/Contract';
import Table, { ITable } from '@/components/ITOTable';
import { useParticipate } from '@/contexts/participate';
import { getITOrowSections, ITOheaders, requestITOSQuery } from '@/pages/ito';
import { IParsedITO } from '@/types';
import { TableContainer, TableHeader, TableTitle } from '@/views/launchpad';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

export const HomeITOSection: React.FC = () => {
  const [ITO, setITO] = useState<IParsedITO | null>(null);
  const {
    openParticipateModal,
    setOpenParticipateModal,
    txHash,
    setTxHash,
    setLoading,
  } = useParticipate();
  const router = useRouter();

  const rowSections = useCallback(
    getITOrowSections(setITO, setOpenParticipateModal, 'home'),
    [setITO, setOpenParticipateModal],
  );

  const tableProps: ITable = {
    rowSections,
    header: ITOheaders,
    type: 'launchPad',
    request: (page, limit) => requestITOSQuery(page, limit, router),
    dataName: 'itos',
    scrollUp: false,
    showLimit: false,
    showPagination: false,
  };

  const hashProps = {
    hash: txHash,
    setHash: setTxHash,
  };

  return (
    <>
      <TableContainer>
        <TableHeader>
          <TableTitle>
            Live Projects
            <Link
              href={{
                pathname: '/ito',
              }}
            >
              <a>
                {' '}
                View All
                <PurpleArrowRight />
              </a>
            </Link>
          </TableTitle>
        </TableHeader>
        {txHash && <HashComponent {...hashProps} />}

        <Table {...tableProps} />
      </TableContainer>
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
    </>
  );
};
