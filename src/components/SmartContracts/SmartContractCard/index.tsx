import AssetLogo from '@/components/Logo/AssetLogo';
import {
  SmartContractDataCard,
  SmartContractDataCardHeader,
  SmartContractDataCardHeaderItem,
  SmartContractDataCardInfo,
  SmartContractDataCardInfoColumn,
  SmartContractDataWrapper,
} from './styles';
import { formatDate } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import Copy from '@/components/Copy';
import { useTranslation } from 'react-i18next';

interface SmartContractCardProps {
  name: string;
  timestamp: number;
  contractAddress: string;
  deployer: string;
  deployTxHash: string;
  totalTransactions: number;
}

const SmartContractCard = ({
  name,
  timestamp,
  contractAddress,
  deployer,
  deployTxHash,
  totalTransactions,
}: SmartContractCardProps): JSX.Element => {
  const { t } = useTranslation(['smartContracts']);
  return (
    <SmartContractDataWrapper>
      <SmartContractDataCard>
        <SmartContractDataCardHeader>
          <SmartContractDataCardHeaderItem>
            <AssetLogo
              logo={'/assets/klv-logo.png?w=1920'}
              ticker={'KLV'}
              name={name}
            />
            <span>{name || '- -'}</span>
          </SmartContractDataCardHeaderItem>
          <span>{formatDate(timestamp)}</span>
        </SmartContractDataCardHeader>
        <SmartContractDataCardHeader>
          <small>{parseAddress(contractAddress, 25)}</small>
          <Copy data={contractAddress} info="contractAddress" />
        </SmartContractDataCardHeader>
        <SmartContractDataCardInfo>
          <SmartContractDataCardInfoColumn>
            <span>{t('smartContracts:Cards.Deployer')}</span>
            <span>{parseAddress(deployer, 12)}</span>
          </SmartContractDataCardInfoColumn>
          <SmartContractDataCardInfoColumn>
            <span>{t('smartContracts:Cards.Deploy Hash')}</span>
            <span>{parseAddress(deployTxHash, 12)}</span>
          </SmartContractDataCardInfoColumn>
        </SmartContractDataCardInfo>
        <SmartContractDataCardInfo>
          <SmartContractDataCardInfoColumn>
            <span>{t('smartContracts:Cards.Total Transactions')}</span>
            <span>{totalTransactions}</span>
          </SmartContractDataCardInfoColumn>
        </SmartContractDataCardInfo>
      </SmartContractDataCard>
    </SmartContractDataWrapper>
  );
};

export default SmartContractCard;
