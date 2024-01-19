import { Loader } from '@/components/Loader/styles';
import Tooltip from '@/components/Tooltip';
import { exportToCsv } from '@/utils/csv';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { TbTableExport } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { DropdownItem, DropdownMenu, ExportButtonContainer } from './styles';

const ExportButton: React.FC<{
  items: any;
  tableRequest: (page: number, limit: number) => Promise<any>;
}> = ({ items, tableRequest }) => {
  const router = useRouter();
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [open, setOpen] = useState(false);
  const exportCurrent = async () => {
    setLoadingCsv(true);
    await exportToCsv('transactions', items, router);
    setLoadingCsv(false);
  };

  const exportAll = async () => {
    setLoadingCsv(true);
    const limit = 100;
    const promises = [];
    for (let page = 1; page <= 100; page++) {
      promises.push(
        tableRequest(page, limit).then(res => ({ page, items: res?.items })),
      );
    }

    try {
      const res = await Promise.all(promises);

      res.sort((a, b) => a.page - b.page);

      const pageOrderedItems = res.flatMap(r => (r.items ? r.items : []));

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
        Component={() =>
          loadingCsv ? <Loader /> : <TbTableExport size={25} />
        }
      />

      <DropdownMenu
        open={open}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <DropdownItem onClick={exportCurrent}>Current Page</DropdownItem>
        <DropdownItem onClick={exportAll}>All Pages</DropdownItem>
      </DropdownMenu>
    </ExportButtonContainer>
  );
};

export default ExportButton;
