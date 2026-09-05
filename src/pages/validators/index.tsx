import { Validators as Icon } from '@/assets/title-icons';
import { klvAmount } from '@/components/DataList/format';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { ROW_LAYOUT_MIN_WIDTH } from '@/components/DataList/layout';
import {
  RIGHT_ALIGNED_COLUMNS,
  VALIDATOR_COLUMNS,
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
import { useColumnHeaders } from '@/components/DataList/useColumnHeaders';
import { useValidatorSources } from '@/components/ValidatorsList/useValidatorSources';
import { useVersionStats } from '@/components/ValidatorsList/useVersionStats';
import VersionDistribution, {
  DistributionMode,
} from '@/components/Validators/VersionDistribution';
import { validatorsTableRequest } from '@/services/requests/validators';
import {
  canFilterByVersion,
  versionFilteredPage,
} from '@/services/requests/validators/versionFilter';
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
  const header = useColumnHeaders(VALIDATOR_COLUMNS);
  const { t } = useTranslation(['common', 'validators']);
  // The page owns the recovery poll; the summary and the filter bar read the
  // same query without adding a second and third timer to it.
  const { data: sources, isLoading, dataUpdatedAt } = useValidatorSources(true);
  const { latestVersion, stats: versionStats } = useVersionStats();
  const [distributionMode, setDistributionMode] =
    useState<DistributionMode>('nodes');

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
    versionUnavailable: t('validators:List.VersionUnavailable'),
    versionUnavailableReason: t('validators:List.VersionUnavailableReason'),
    noDelegationLimit: t('validators:List.NoDelegationLimit'),
    statusLabel: (status: string) =>
      t(`validators:States.${status}`, { defaultValue: status }),
    capacityDetail: (staked, cap) =>
      t('validators:List.CapacityDetail', {
        staked: klvAmount(staked),
        cap: klvAmount(cap),
      }),
  };

  const selectedVersion =
    typeof router.query.version === 'string' ? router.query.version : undefined;

  const versionFilterable = canFilterByVersion({
    version: selectedVersion,
    heartbeatAvailable: sources.heartbeatAvailable,
    validatorsAvailable: sources.validatorsAvailable,
  });

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
    // against the heartbeat join the shared query already holds. With either
    // half of that join down the filter is dropped rather than answered: the
    // unfiltered list is a true answer where an empty filtered page is not,
    // and the version card above already names the outage.
    if (versionFilterable) {
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
        heartbeatAvailable: sources.heartbeatAvailable,
        sourcesLoading: isLoading,
        labels,
      }),
    dataName: 'validators',
    request,
    Filters: ValidatorsFilters,
    MobileCard: ValidatorsMobileCard,
    // Once here, not per card: ten cards resolving the join themselves would
    // each subscribe to the same shared query.
    mobileCardProps: {
      versionMap: sources.versionMap,
      latestVersion,
      heartbeatAvailable: sources.heartbeatAvailable,
      sourcesLoading: isLoading,
    },
    singleLineSkeleton: true,
    rightAlignedSkeletonColumns: RIGHT_ALIGNED_COLUMNS,
    // Same source as the wrapper's media queries, so the loading rows and the
    // loaded rows cannot end up in different shapes.
    cardBreakpoint: ROW_LAYOUT_MIN_WIDTH,
    /* A version-filtered URL cannot be answered from the API, so the table
       holds its loading rows until the join has settled one way or the other.
       Answering meanwhile served the unfiltered list, with the unfiltered
       record count in the pager, under a filtered URL. */
    requestReady: !selectedVersion || !isLoading,
    /* Keyed on when the shared query last settled, and only while the filter
       can actually be answered from it. Both earlier keys were derived from
       one half of the join and each left the other half's recovery invisible.
       Gating on `canFilterByVersion` keeps the recovery poll from minting a
       key per settle in the state where the request goes to the API anyway:
       measured with the heartbeat blocked, three identical list requests where
       the same page without `?version=` made one. */
    refreshKey: versionFilterable ? dataUpdatedAt : 0,
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
