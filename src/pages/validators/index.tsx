import { Validators as Icon } from '@/assets/title-icons';
import { klvAmount } from '@/components/DataList/format';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import {
  RIGHT_ALIGNED_COLUMNS,
  ROW_LAYOUT_MIN_WIDTH,
} from '@/components/ValidatorsList/columns';
import ValidatorsFilters from '@/components/ValidatorsList/Filters';
import ValidatorsMobileCard, {
  type IValidatorsMobileCardExtras,
} from '@/components/ValidatorsList/MobileCard';
import {
  validatorRowSections,
  IValidatorRowContext,
} from '@/components/ValidatorsList/rows';
import { ValidatorsTableWrapper } from '@/components/ValidatorsList/styles';
import ValidatorsSummary from '@/components/ValidatorsList/Summary';
import { useValidatorHeaders } from '@/components/ValidatorsList/useValidatorHeaders';
import { useValidatorSources } from '@/components/ValidatorsList/useValidatorSources';
import VersionDistribution, {
  DistributionMode,
} from '@/components/Validators/VersionDistribution';
import {
  buildVersionStats,
  latestVersionAmongValidators,
} from '@/services/requests/heartbeat';
import { validatorsTableRequest } from '@/services/requests/validators';
import { versionFilteredPage } from '@/services/requests/validators/versionFilter';
import { Container, Header } from '@/styles/common';
import { setQueryAndRouter } from '@/utils';
import { IPaginatedResponse, IRowSection, IValidator } from '@/types/index';
import { GetServerSideProps } from 'next';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

const Validators: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const header = useValidatorHeaders();
  const { t } = useTranslation(['common', 'validators']);
  // The page owns the recovery poll; the summary and the filter bar read the
  // same query without adding a second and third timer to it.
  const { data: sources, isLoading, dataUpdatedAt } = useValidatorSources(true);
  const [distributionMode, setDistributionMode] =
    useState<DistributionMode>('nodes');

  const latestVersion =
    latestVersionAmongValidators(sources.validators, sources.versionMap) ||
    undefined;

  const labels: IValidatorRowContext['labels'] = {
    copyAddress: t('validators:List.CopyAddress'),
    addressCopied: t('validators:List.AddressCopied'),
    openValidator: t('validators:List.OpenValidator'),
    openInNewTab: t('validators:List.OpenInNewTab'),
    canDelegate: t('validators:List.CanDelegate'),
    canDelegateTooltip: t('validators:List.CanDelegateTooltip'),
    cannotDelegate: t('validators:List.CannotDelegate'),
    cannotDelegateTooltip: t('validators:List.CannotDelegateTooltip'),
    missedShare: t('validators:List.MissedShare'),
    unknownVersion: t('validators:List.UnknownVersion'),
    noDelegationLimit: t('validators:List.NoDelegationLimit'),
    capacityDetail: (staked, cap) =>
      t('validators:List.CapacityDetail', {
        staked: klvAmount(staked),
        cap: klvAmount(cap),
      }),
  };

  const selectedVersion =
    typeof router.query.version === 'string' ? router.query.version : undefined;

  const versionStats = sources.validatorsAvailable
    ? buildVersionStats(
        sources.validators,
        sources.versionMap,
        latestVersion ?? '',
      )
    : [];

  const handleSelectVersion = (version: string | undefined): void => {
    // Back to page one: a narrower set has fewer pages, so staying put would
    // land on an empty page with no control to get back from.
    const updated: NextParsedUrlQuery = { ...router.query, version };
    if (!version) delete updated.version;
    delete updated.page;
    setQueryAndRouter(updated, router);
  };

  const request = async (
    page: number,
    limit: number,
  ): Promise<IPaginatedResponse> => {
    // The version filter has no server-side counterpart, so it is resolved
    // against the heartbeat join the shared query already holds.
    if (selectedVersion) {
      /* No guard holding this pending until the join lands. That was tried and
         measured: react-query keeps the first promise a key produces, so a
         never-settling one leaves the table on ten skeleton rows for the whole
         outage, with the refresh and retry controls both inert because the
         query has no data to cancel against. Answering from whatever arrived
         reaches a terminal state, and `refreshKey` below re-runs it the moment
         the version map does arrive: measured, the table went from the empty
         state to 100 rows without a reload. */
      return versionFilteredPage(
        sources.validators,
        sources.versionMap,
        {
          version: selectedVersion,
          name:
            typeof router.query.name === 'string'
              ? router.query.name
              : undefined,
        },
        page,
        limit,
      );
    }
    return validatorsTableRequest(page, limit, router.query);
  };

  const tableProps: ITable<IValidatorsMobileCardExtras> = {
    type: 'validators',
    header,
    rowSections: (validator: IValidator | string): IRowSection[] =>
      validatorRowSections(validator, {
        versionMap: sources.versionMap,
        latestVersion,
        labels,
      }),
    dataName: 'validators',
    request,
    Filters: ValidatorsFilters,
    MobileCard: ValidatorsMobileCard,
    // Once here, not per card: ten cards resolving the join themselves would
    // each subscribe to the same shared query.
    mobileCardProps: { versionMap: sources.versionMap, latestVersion },
    singleLineSkeleton: true,
    rightAlignedSkeletonColumns: RIGHT_ALIGNED_COLUMNS,
    // Same source as the wrapper's media queries, so the loading rows and the
    // loaded rows cannot end up in different shapes.
    cardBreakpoint: ROW_LAYOUT_MIN_WIDTH,
    /* Keyed on when the shared query last settled, not on a shape derived from
       one of its halves. Both earlier keys did the latter and each left the
       other half's recovery invisible: on the list it missed a returning
       heartbeat, on the version map it missed a returning list, and that
       second one was reproduced with a control (list blocked, then released:
       the version card reported 143 nodes on a version while the table
       filtered on it stayed empty indefinitely). This marker moves whenever
       either half does. */
    refreshKey: selectedVersion ? dataUpdatedAt : 0,
  };

  return (
    <Container>
      <Header>
        <Title title={t('common:Titles.Validators')} Icon={Icon} />
      </Header>

      <ValidatorsSummary />

      <VersionDistribution
        stats={versionStats}
        latestVersion={latestVersion}
        loading={isLoading}
        heartbeatAvailable={sources.heartbeatAvailable}
        validatorsAvailable={sources.validatorsAvailable}
        mode={distributionMode}
        onModeChange={setDistributionMode}
        selectedVersion={selectedVersion}
        onSelectVersion={handleSelectVersion}
      />

      <ValidatorsTableWrapper>
        <Table {...tableProps} />
      </ValidatorsTableWrapper>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'validators', 'table'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Validators;
