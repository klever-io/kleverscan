import api from '@/services/api';
import { IProposalsResponse } from '@/types/proposals';
import { KLV_PRECISION } from '@/utils/globalVariables';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from 'react-query';
import { IContractProps } from '.';
import { FormSection } from '../../Form/styles';
import FormInput from '../FormInput';
import { FormBody } from '../styles';

type FormData = {
  proposalId: number;
  amount: number;
  type: number;
};

const parseVote = (data: FormData) => {
  data.type = data.type ? 1 : 0;
};

const Vote: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { handleSubmit } = useFormContext<FormData>();

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

  const { data: proposals } = useQuery('proposals', getProposals);

  const onSubmit = async (data: FormData) => {
    parseVote(data);
    await handleFormSubmit(data);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <FormInput
          name="proposalId"
          title="Proposal ID"
          type="dropdown"
          options={proposals}
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
      </FormSection>
    </FormBody>
  );
};

export default Vote;
