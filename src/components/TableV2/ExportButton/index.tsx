import { PageDownload } from '@/assets/icons';
import { Loader } from '@/components/Loader/styles';
import Tooltip from '@/components/Tooltip';
import { exportToCsv } from '@/utils/csv';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  DropdownItem,
  DropdownMenu,
  ExportButtonContainer,
  ExportProgressBar,
  ExportProgressContainer,
  ExportProgressText,
} from './styles';

const ExportButton: React.FC<{
  items: any;
  tableRequest: (page: number, limit: number) => Promise<any>;
  totalRecords?: number;
}> = ({ items, tableRequest, totalRecords }) => {
  const router = useRouter();
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [open, setOpen] = useState(false);
  const exportCurrent = async () => {
    setLoadingCsv(true);
    await exportToCsv('transactions', items, router);
    setLoadingCsv(false);
  };
  const [progress, setProgress] = useState(0);

  const exportAll = async () => {
    setLoadingCsv(true);
    setProgress(0);
    const limit = 100;
    const totalPages = totalRecords ? Math.ceil(totalRecords / limit) : 100;
    const batchSize = 5;
    let allResults: any[] = [];

    try {
      for (let i = 0; i < totalPages; i += batchSize) {
        const promises = [];
        for (let j = i; j < Math.min(i + batchSize, totalPages); j++) {
          const page = j + 1;
          promises.push(
            tableRequest(page, limit).then(res => ({
              page,
              items: res?.items,
            })),
          );
        }

        const batchResults = await Promise.all(promises);
        allResults = allResults.concat(batchResults);
        setProgress(((i + batchSize) / totalPages) * 100);
      }

      allResults.sort((a, b) => a.page - b.page);
      const pageOrderedItems = allResults.flatMap(r =>
        r.items ? r.items : [],
      );
      await exportToCsv('transactions', pageOrderedItems, router);
    } catch (error) {
      console.error(error);
      toast.error(
        'Error exporting CSV, try exporting successful transactions only. If the problem persists, contact support.',
      );
    } finally {
      setLoadingCsv(false);
    }
  };

  return (
    <ExportButtonContainer
      onClick={() => {
        setOpen(!open);
      }}
    >
      <Tooltip
        msg="CSV"
        Component={() => (loadingCsv ? <Loader /> : <PageDownload size={25} />)}
      />

      <DropdownMenu
        open={open}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <DropdownItem disabled={loadingCsv} onClick={exportCurrent}>
          Current Page
        </DropdownItem>
        <DropdownItem disabled={loadingCsv} onClick={exportAll}>
          All Pages
        </DropdownItem>

        {loadingCsv && (
          <>
            <ExportProgressText>Getting Data...</ExportProgressText>
            <ExportProgressContainer>
              <ExportProgressBar progress={progress} />
            </ExportProgressContainer>
          </>
        )}
      </DropdownMenu>
    </ExportButtonContainer>
  );
};

export default ExportButton;
