import { useContract } from '@/contexts/contract';
import { useExtension } from '@/contexts/extension';
import api from '@/services/api';
import { myAccountCall } from '@/services/requests/account';
import { IProposalsResponse } from '@/types/proposals';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from 'react-query';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection, SpanMessage } from '../styles';

type FormData = {
  proposalId: number;
  amount: number;
  type: number;
};

const parseVote = (data: FormData) => {
  data.type = data.type ? 1 : 0;
};

const Vote: React.FC<PropsWithChildren<IContractProps>> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit } = useFormContext<FormData>();
  const router = useRouter();
  const ProposalID = router?.query?.number;

  const getProposals = async () => {
    const proposalResponse: IProposalsResponse = await api.get({
      route: 'proposals/list',
    });

    const proposals: any = [];

    const descriptionProposal = (item: any) => {
      if (item.description !== '') {
        if (item.description.length < 40) {
          return `${item.proposalId}: ${item.description}`;
        }
        return `${item.proposalId}: ${item.description.substring(0, 40)}...`;
      }

      return String(item.proposalId);
    };

    proposalResponse?.data?.proposals
      .filter(proposal => proposal.proposalStatus === 'ActiveProposal')
      .forEach((item: any) => {
        proposals.push({
          label: descriptionProposal(item),
          value: item.proposalId,
        });
      });

    return proposals.sort((a: any, b: any) => (a.value > b.value ? 1 : -1));
  };
  const { walletAddress } = useExtension();
  const { senderAccount } = useContract();
  const { data: proposals } = useQuery('proposals', getProposals);
  const {
    data: account,
    isLoading: isLoadingAccount,
    refetch,
  } = useQuery({
    queryKey: [`account`],
    queryFn: () =>
      myAccountCall(senderAccount !== '' ? senderAccount : walletAddress),
    enabled: !!walletAddress,
  });

  const onSubmit = async (data: FormData) => {
    parseVote(data);
    await handleFormSubmit(data);
  };

  useEffect(() => {
    refetch();
  }, [senderAccount]);

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="proposalId"
          title="Proposal ID"
          type="dropdown"
          options={proposals}
          defaultValue={ProposalID}
          required
        />
        <br />
      </FormSection>
      <FormSection>
        <FormInput
          name="amount"
          title="Amount"
          type="number"
          tooltip="Vote weight depends on the amount of KFI held, the KFI is not spent."
          precision={KLV_PRECISION}
          required
        />
        <FormInput
          name="type"
          title="Type"
          type="checkbox"
          toggleOptions={['In Favor', 'Against']}
        />
        <SpanMessage>
          Your KFI amount:{' '}
          {formatAmount(
            (account?.assets['KFI']?.buckets?.reduce(
              (acc, current) => acc + current.balance,
              0,
            ) || 0) /
              10 ** KLV_PRECISION,
          )}
        </SpanMessage>
      </FormSection>
    </FormBody>
  );
};

export default Vote;
