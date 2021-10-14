import React, { Fragment, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaLaravel } from 'react-icons/fa';
import { GetStaticProps } from "next";
import { format, fromUnixTime } from 'date-fns'
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

import { contracts, ITransaction, IResponse, Contract, ITransferContract, ICreateAssetContract, ICreateAssetReceipt, IFreezeReceipt, IUnfreezeReceipt, ICreateValidatorContract, IFreezeContract, IUnfreezeContract, IWithdrawContract } from "../../types";
import {
  Container,
  Content,
  Divider,
  Header,
  HeaderIcon,
  Indicator,
  Info,
  Tab,
  TabContainer,
} from '../../views/blocks';

import Input from '../../components/Input';

import api from "../../services/api";

interface ITransactionResponse extends IResponse {
  data: {
    transaction: ITransaction;
  };
}

interface IData {
  name: string;
  info: string | number | boolean;
  linked?: string;
}


interface ITab {
  title: string;
  data: Array<IData>
}
const Transaction: React.FC<ITransaction> = props => {

  const getContract = (): IData[] => {
    const { contract } = props;

    if (contract.length <= 0) {
      return [] as IData[]
    }

    console.log(contract[0].type)

    switch (contract[0].type) {
      case Contract.Transfer:

        const transferParam = contract[0].parameter as ITransferContract

        return [
          { name: 'Contract', info: contracts[contract[0].type] },
          { name: 'From', info: transferParam.ownerAddress },
          { name: 'To', info: transferParam.toAddress },
          { name: 'Amount', info: transferParam.amount },
          ...(!!transferParam.assetAddress ? [{ name: 'Asset Address', info: transferParam.assetAddress }] : [])
        ]


      case Contract.CreateAsset:
        const createAssetParam = contract[0].parameter as ICreateAssetContract

        return [
          { name: 'Contract', info: contracts[contract[0].type] },
          { name: 'Name', info: createAssetParam.name },
          { name: 'Owner Address', info: createAssetParam.ownerAddress },
          { name: 'Token', info: createAssetParam.ticker },
          { name: 'Precision', info: createAssetParam.precision },
          { name: 'Circulating Supply', info: createAssetParam.circulatingSupply },
          { name: 'Initial Supply', info: createAssetParam.initialSupply },
          { name: 'Max Supply', info: createAssetParam.maxSupply },
        ]

      case Contract.CreateValidator:
      case Contract.ValidatorConfig:

        console.log(contract[0].parameter)


        const validatorParam = contract[0].parameter as ICreateValidatorContract


        return [
          { name: 'Contract', info: contracts[contract[0].type] },
          { name: 'Owner Address', info: validatorParam.ownerAddress },
          { name: 'Can Delegate', info: validatorParam.config.canDelegate ? "True" : "False" },
          { name: 'Comission', info: validatorParam.config.commission },
          { name: 'Max Delegation Amount', info: validatorParam.config.maxDelegationAmount },
          { name: 'Reward address', info: validatorParam.config.rewardAddress },
        ]

      case Contract.Freeze:


        const freezeParam = contract[0].parameter as IFreezeContract

        return [
          { name: 'Contract', info: contracts[contract[0].type] },
          { name: 'Owner Address', info: freezeParam.ownerAddress },
          { name: 'Owner Address', info: freezeParam.amount },
        ]



      case Contract.Unfreeze:
      case Contract.Delegate:
      case Contract.Undelegate:

        const params = contract[0].parameter as IUnfreezeContract

        return [
          { name: 'Contract', info: contracts[contract[0].type] },
          { name: 'Owner Address', info: params.ownerAddress },
          { name: 'Bucket ID', info: params.bucketID },
        ]

      case Contract.Withdraw:

        const withDrawParams = contract[0].parameter as IWithdrawContract

        return [
          { name: 'Contract', info: contracts[contract[0].type] },
          { name: 'Owner Address', info: withDrawParams.ownerAddress },
          { name: 'To Address', info: withDrawParams.toAddress },

        ]

      default:
        console.log("OPAAA")
        return [] as IData[]
    }
  }

  const getReceipt = (): IData[] => {
    const { contract, receipt } = props;

    if (contract.length <= 0) {
      return [] as IData[]
    }

    switch (contract[0].type) {
      case Contract.CreateAsset:

        const createAssetReceipt = receipt[0] as ICreateAssetReceipt

        return [
          { name: 'Asset ID', info: createAssetReceipt.assetId },
        ]

      case Contract.Freeze:

        const freezeReceipt = receipt[0] as IFreezeReceipt

        return [
          { name: 'Bucket ID', info: freezeReceipt.bucketId },
        ]


      case Contract.Unfreeze:

        const unfreezeReceipt = receipt[0] as IUnfreezeReceipt

        return [
          { name: 'Avaliable Withdraw Epoch', info: unfreezeReceipt.availableWithdrawEpoch },
        ]

      default:
        return [] as IData[]
    }
  }


  const overviewData: IData[] = [
    { name: 'Hash', info: props.hash },
    { name: 'Block Number', info: props.blockNum },
    { name: 'Sender', info: props.sender },
    { name: 'Timestamp', info: format(fromUnixTime(props.timeStamp), "dd/MM/yyyy HH:mm") },
    { name: 'Signature', info: props.signature },
    { name: 'Kapp Fee', info: props.kappFee },
    { name: 'Bandwith Fee', info: props.bandwidthFee },
    { name: 'Consumed Fee', info: props.consumedFee },
  ];



  const contractData = getContract()
  const receiptData = getReceipt()


  const tabs: ITab[] = [
    { title: 'Overview', data: overviewData },
    { title: 'Contract', data: contractData },
    ...(receiptData.length > 0 ? [{ title: 'Receipt', data: receiptData }] : [])
  ];



  const [selectedTab, setSelectedTab] = useState<ITab>(tabs[0]);

  useEffect(() => {
    const tab = document.getElementById(
      `tab-${selectedTab.title.toLowerCase()}`,
    );
    const indicator = document.getElementById('tab-indicator');

    if (indicator && tab) {
      indicator.style.width = `${String(tab.offsetWidth)}px`;
      indicator.style.transform = `translateX(${String(tab.offsetLeft)}px)`;
    }
  }, [selectedTab]);


  const renderTabs = () =>
    tabs.map((tab, index) => {
      const id = `tab-${tab.title.toLowerCase()}`;
      const active = tab.title === selectedTab.title;
      const handleTab = () => setSelectedTab(tab);

      const props = { id, active, onClick: handleTab };

      return (
        <Tab key={String(index)} {...props}>
          {tab.title}
        </Tab>
      );
    });


  const handleCopyInfo = (info: string, data: string | number | boolean) => {
    const toastProps = {
      autoClose: 2000,
      pauseOnHover: false,
      closeOnClick: true,
    };

    navigator.clipboard.writeText(String(data));
    toast.info(`${info} copied to clipboard`, toastProps);
  };



  return (
    <Container>
      <ToastContainer />
      <Input />
      <Header>
        <HeaderIcon>
          <FaLaravel />
        </HeaderIcon>
        <h3>Transaction Details</h3>
      </Header>

      <Content>
        <TabContainer>
          <Indicator id="tab-indicator" />


          {renderTabs()}
        </TabContainer>
        {selectedTab.data.map((data, index) => {
          return (
            <Fragment key={String(index)}>
              <Info>
                <span>{data.name}</span>
                {data.linked ? (
                  <Link href={data.linked}>{data.info}</Link>
                ) : (
                  <p onClick={() => handleCopyInfo(data.name, data.info)}>
                    {data.info}
                  </p>
                )}
              </Info>

              {index + 1 !== selectedTab.data.length && <Divider />}
            </Fragment>
          );
        })}
      </Content>



    </ Container>
  )

}


export const getServerSideProps: GetStaticProps<ITransaction> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const hash = params?.hash

  if (!hash) {
    return redirectProps;
  }

  const transaction: ITransactionResponse = await api.get({
    route: `transaction/${hash}`
  })


  if (transaction.error) {
    return redirectProps;
  }

  const props: ITransaction = transaction.data.transaction

  return { props };
};




export default Transaction