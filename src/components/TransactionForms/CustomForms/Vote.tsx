import api from '@/services/api';
import { IProposalsResponse } from '@/types/proposals';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from 'react-query';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import { FormBody, FormSection } from '../styles';

type FormData = {
  proposalId: number;
  amount: number;
  type: number;
};

const parseVote = (data: FormData) => {
  data.type = data.type ? 1 : 0;
};

const Vote: React.FC<IContractProps> = ({ formKey, handleFormSubmit }) => {
  const { t } = useTranslation('transactions');
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
          title={t('Proposal.Proposal Id')}
          type="dropdown"
          options={proposals}
          required
        />
        <br />
      </FormSection>
      <FormSection>
        <FormInput
          name="amount"
          title={t('Amount')}
          type="number"
          tooltip="Vote weight depends on the amount of KFI held, the KFI is not spent."
          precision={KLV_PRECISION}
          required
        />
        <FormInput
          name="type"
          title={t('Type')}
          type="checkbox"
          toggleOptions={['In Favor', 'Against']}
        />
      </FormSection>
    </FormBody>
  );
};

export default Vote;
