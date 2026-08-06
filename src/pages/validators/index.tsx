import { Validators as Icon } from '@/assets/cards';
import Copy from '@/components/Copy';
import Detail from '@/components/Detail';
import { IFilter } from '@/components/Filter';
import Progress from '@/components/Progress';
import { ITable } from '@/components/Table';
import { CustomFieldWrapper, Status } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import VersionDistribution, {
  DistributionMode,
} from '@/components/Validators/VersionDistribution';
import api from '@/services/api';
import {
  buildVersionStats,
  fetchHeartbeatStatus,
  latestVersionAmongValidators,
  resolveValidatorVersion,
  UNKNOWN_VERSION,
} from '@/services/requests/heartbeat';
import { fetchAllValidators } from '@/services/requests/validators';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
import { IPaginatedResponse, IRowSection, IValidator } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useFetchPartial } from '@/utils/hooks';
import { parseValidators } from '@/utils/parseValues';
import { AddressContainer } from '@/views/validators/detail';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { transparentize } from 'polished';
import styled from 'styled-components';

/** Matches Version Distribution badges: green = latest, amber = behind (not error red). */
const VersionStatus = styled(Status)`
  width: fit-content;
  max-width: none;
  padding: 2px 10px;

  /* Light mode: stronger chip contrast (same tokens as distribution panel). */
  ${props =>
    !props.theme.dark &&
    props.status === 'success' &&
    `
      color: #1b7a4e !important;
      background-color: #e6f6ee !important;
    `}

  ${props =>
    !props.theme.dark &&
    props.status === 'pending' &&
    `
      color: #9a6200 !important;
      background-color: #fff4e0 !important;
    `}

  ${props =>
    props.theme.dark &&
    props.status === 'pending' &&
    `
      color: ${props.theme.table.pending} !important;
      background-color: ${transparentize(0.85, props.theme.table.pending)} !important;
    `}
`;

export const validatorsHeaders = [
  'Rank',
  'Name/Can Delegate',
  'Status/Rating',
  'Stake/Commission',
  'Produced / Missed',
  'Software Version',
  'Cumulative Stake',
];

const omitEmptyQuery = (
  query: Record<string, string | string[] | undefined>,
): Record<string, string | string[] | undefined> => {
  const next: Record<string, string | string[] | undefined> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    next[key] = value;
  });
  return next;
};

const Validators: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const [filterValidators, fetchPartialValidator, loading, setLoading] =
    useFetchPartial<IValidator>('validators', 'validator/list', 'name');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [versionMap, setVersionMap] = useState<Record<string, string>>({});
  const [versionLoading, setVersionLoading] = useState(true);
  const [heartbeatAvailable, setHeartbeatAvailable] = useState(false);
  const [allValidators, setAllValidators] = useState<IValidator[]>([]);
  const [validatorsLoading, setValidatorsLoading] = useState(true);
  const [validatorsAvailable, setValidatorsAvailable] = useState(false);
  const [totalValidators, setTotalValidators] = useState<number | undefined>();
  const [distributionMode, setDistributionMode] =
    useState<DistributionMode>('nodes');
  // Bumps only when a version filter is active and join data becomes ready.
  const [versionFilterReadyKey, setVersionFilterReadyKey] = useState(0);

  // Refs so table request always sees the latest join data without stale closures.
  const versionMapRef = useRef(versionMap);
  const allValidatorsRef = useRef(allValidators);
  // Lazy-init once: useRef(new Promise(...)) re-runs the initializer every
  // render and would overwrite the resolve callback while keeping the first
  // promise — hangers on await dataReadyPromiseRef when ?version= is set.
  const dataReadyResolveRef = useRef<(() => void) | null>(null);
  const dataReadyPromiseRef = useRef<Promise<void> | null>(null);
  if (!dataReadyPromiseRef.current) {
    dataReadyPromiseRef.current = new Promise<void>(resolve => {
      dataReadyResolveRef.current = resolve;
    });
  }
  const dataReadyRef = useRef(false);

  useEffect(() => {
    versionMapRef.current = versionMap;
  }, [versionMap]);

  useEffect(() => {
    allValidatorsRef.current = allValidators;
  }, [allValidators]);

  const selectedVersion =
    typeof router.query.version === 'string' ? router.query.version : undefined;

  useEffect(() => {
    if (!versionLoading && !validatorsLoading && !dataReadyRef.current) {
      dataReadyRef.current = true;
      dataReadyResolveRef.current?.();
      // Safety re-fetch if a deep-linked version filter resolved before join data.
      if (selectedVersion) {
        setVersionFilterReadyKey(k => k + 1);
      }
    }
  }, [versionLoading, validatorsLoading, selectedVersion]);

  useEffect(() => {
    const loadHeartbeat = async () => {
      const result = await fetchHeartbeatStatus();
      if (result) {
        setVersionMap(result.versionMap);
        setHeartbeatAvailable(true);
      } else {
        setHeartbeatAvailable(false);
      }
      setVersionLoading(false);
    };
    loadHeartbeat();
  }, []);

  useEffect(() => {
    const loadValidators = async () => {
      try {
        const result = await fetchAllValidators();
        setAllValidators(result.validators);
        setTotalValidators(result.totalRecords);
        setValidatorsAvailable(true);
      } catch {
        // Keep totalValidators undefined so the table path can still set it.
        setValidatorsAvailable(false);
        setAllValidators([]);
      } finally {
        setValidatorsLoading(false);
      }
    };
    loadValidators();
  }, []);

  // Newest version among listed validators with heartbeat (not observers).
  const latestVersion = useMemo(() => {
    if (!Object.keys(versionMap).length) return undefined;
    const among = latestVersionAmongValidators(allValidators, versionMap);
    return among || undefined;
  }, [allValidators, versionMap]);

  const versionStats = useMemo(
    () =>
      validatorsAvailable
        ? buildVersionStats(allValidators, versionMap, latestVersion ?? '')
        : [],
    [allValidators, versionMap, latestVersion, validatorsAvailable],
  );

  const updateQuery = useCallback(
    (patch: Record<string, string | undefined>) => {
      const merged = omitEmptyQuery({
        ...router.query,
        ...patch,
        page: patch.page !== undefined ? patch.page : '1',
      });
      // Drop page when resetting to first page to keep URLs clean.
      if (merged.page === '1') {
        delete merged.page;
      }
      setQueryAndRouter(merged, router);
    },
    [router],
  );

  const handleSelectVersion = useCallback(
    (version: string | undefined) => {
      updateQuery({ version, page: '1' });
    },
    [updateQuery],
  );

  const validatorsRowSections = useCallback(
    (validator: IValidator): IRowSection[] => {
      const {
        name,
        ownerAddress,
        parsedAddress,
        rank,
        staked,
        commission,
        cumulativeStaked,
        rating,
        status,
        totalProduced,
        totalMissed,
        canDelegate,
        blsPublicKey,
      } = validator;

      const softwareVersionRaw = blsPublicKey
        ? resolveValidatorVersion(blsPublicKey, versionMap)
        : undefined;
      const softwareVersion =
        softwareVersionRaw && softwareVersionRaw !== UNKNOWN_VERSION
          ? softwareVersionRaw
          : undefined;
      const sections: IRowSection[] = ownerAddress
        ? [
            {
              element: props => <p key={rank}>{rank}°</p>,
              span: 1,
              width: 100,
            },
            {
              element: props => (
                <DoubleRow key={ownerAddress + status} {...props}>
                  <span>
                    {
                      <AddressContainer>
                        <Link
                          href={`validator/${ownerAddress}`}
                          data-testid="validator-link"
                        >
                          {name ? name : <Mono>{parsedAddress}</Mono>}
                        </Link>
                        <Copy data={ownerAddress} info="Validator Address" />
                      </AddressContainer>
                    }
                  </span>
                  <Status
                    status={canDelegate ? 'success' : 'fail'}
                    key={String(canDelegate)}
                  >
                    {canDelegate ? 'Yes' : 'No'}
                  </Status>
                </DoubleRow>
              ),
              span: 1,
            },

            {
              element: props => (
                <DoubleRow key={status + rating} {...props}>
                  <span>{capitalizeString(status)}</span>
                  <span>{((rating * 100) / 10000000).toFixed(2)}%</span>
                </DoubleRow>
              ),
              span: 1,
            },
            {
              element: props => (
                <DoubleRow key={staked} {...props}>
                  <span>{formatAmount(staked / 10 ** KLV_PRECISION)} KLV</span>
                  <span key={commission}>{commission / 10 ** 2}%</span>
                </DoubleRow>
              ),
              span: 1,
            },
            {
              element: props => (
                <DoubleRow key={totalProduced} {...props}>
                  <span>{totalProduced}</span>
                  <CenteredRow>
                    <span>{totalMissed}</span>
                    <Tooltip
                      msg="Missed Percentage"
                      Component={() => (
                        <CustomFieldWrapper>
                          <span>
                            {' '}
                            (
                            {totalProduced
                              ? (
                                  ((totalMissed || 0) * 100) /
                                  totalProduced
                                ).toFixed(2)
                              : '- -'}
                            %)
                          </span>
                        </CustomFieldWrapper>
                      )}
                    />
                  </CenteredRow>
                </DoubleRow>
              ),
              span: 1,
            },
            {
              element: props => (
                <CenteredRow key={softwareVersion}>
                  {softwareVersion ? (
                    <VersionStatus
                      status={
                        softwareVersion === latestVersion
                          ? 'success'
                          : 'pending'
                      }
                    >
                      {softwareVersion}
                    </VersionStatus>
                  ) : (
                    <span>-</span>
                  )}
                </CenteredRow>
              ),
              span: 1,
            },
            {
              element: props => (
                <Progress percent={cumulativeStaked} key={cumulativeStaked} />
              ),
              span: 2,
            },
          ]
        : [];

      return sections;
    },
    [latestVersion, versionMap],
  );

  const filters: IFilter[] = useMemo(() => {
    return [
      {
        title: 'Name',
        data: filterValidators
          .map(validator => validator.name)
          .filter(validator => !!validator) as string[],
        onClick: async value => {
          if (value === 'All') {
            updateQuery({ name: undefined, page: '1' });
          } else {
            updateQuery({ name: value, page: '1' });
          }
        },
        onChange: async value => {
          setLoading(true);
          if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = setTimeout(() => {
            updateQuery({ name: value || undefined, page: '1' });
          }, 500);
          await fetchPartialValidator(value);
        },
        current: (router.query.name as string) || undefined,
        loading,
      },
      {
        title: 'Version',
        data: versionStats.map(stat => stat.version),
        onClick: async value => {
          if (value === 'All') {
            handleSelectVersion(undefined);
          } else {
            handleSelectVersion(value);
          }
        },
        current: selectedVersion,
        loading: versionLoading || validatorsLoading,
      },
    ];
  }, [
    filterValidators,
    router.query.name,
    loading,
    versionStats,
    selectedVersion,
    versionLoading,
    validatorsLoading,
    updateQuery,
    handleSelectVersion,
    fetchPartialValidator,
    setLoading,
  ]);

  const requestValidators = async (
    page: number,
    limit: number,
  ): Promise<IPaginatedResponse> => {
    const versionFilter =
      typeof router.query.version === 'string'
        ? router.query.version
        : undefined;
    const nameFilter =
      typeof router.query.name === 'string' ? router.query.name : undefined;

    // Client-side path: version filter requires heartbeat join.
    if (versionFilter) {
      if (!dataReadyRef.current) {
        await dataReadyPromiseRef.current!;
      }

      let list = allValidatorsRef.current;
      const map = versionMapRef.current;

      if (nameFilter) {
        // Mirror validator/list name matching: case-insensitive prefix.
        const needle = nameFilter.toLowerCase();
        list = list.filter(v => v.name?.toLowerCase().startsWith(needle));
      }

      list = list.filter(
        v => resolveValidatorVersion(v.blsPublicKey, map) === versionFilter,
      );

      const totalRecords = list.length;
      const totalPages = Math.max(1, Math.ceil(totalRecords / limit) || 1);
      const safePage = Math.min(Math.max(page, 1), totalPages);
      const start = (safePage - 1) * limit;
      // Preserve network election rank from parseValidators.
      const pageItems = list.slice(start, start + limit);

      return {
        data: { validators: pageItems },
        pagination: {
          self: safePage,
          next: Math.min(safePage + 1, totalPages),
          previous: Math.max(safePage - 1, 1),
          perPage: limit,
          totalPages,
          totalRecords,
        },
        error: '',
        code: 'successful',
      };
    }

    const localQuery = { ...router.query, page, limit };
    // Never send client-only version param to the list API.
    delete (localQuery as Record<string, unknown>).version;

    const validators = await api.get({
      route: 'validator/list',
      query: { sort: 'elected', ...localQuery },
    });

    if (!validators.error) {
      const parsedValidators = parseValidators(validators);
      if (totalValidators === undefined) {
        setTotalValidators(validators.pagination?.totalRecords ?? undefined);
      }
      return { ...validators, data: { validators: parsedValidators } };
    }

    return validators;
  };

  const tableProps: ITable = {
    type: 'validators',
    header: validatorsHeaders,
    rowSections: validatorsRowSections,
    request: (page, limit) => requestValidators(page, limit),
    dataName: 'validators',
    // Only re-run when deep-linked version filter can resolve against join data.
    refreshKey: versionFilterReadyKey,
  };

  const headerLoading = versionLoading || validatorsLoading;

  const versionCard = (
    <VersionDistribution
      stats={versionStats}
      latestVersion={latestVersion}
      totalValidators={totalValidators}
      loading={headerLoading}
      heartbeatAvailable={heartbeatAvailable}
      validatorsAvailable={validatorsAvailable}
      mode={distributionMode}
      onModeChange={setDistributionMode}
      selectedVersion={selectedVersion}
      onSelectVersion={handleSelectVersion}
    />
  );

  const detailProps = {
    title: 'Validators',
    headerIcon: Icon,
    cards: undefined,
    tableProps,
    filters,
    customHeader: versionCard,
  };

  return <Detail {...detailProps} />;
};

export default Validators;
