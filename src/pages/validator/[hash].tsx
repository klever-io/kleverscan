import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Dropdown from '@/components/Dropdown';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Table, { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  IBucket,
  IDelegate,
  IPagination,
  IPeer,
  IResponse,
  IRowSection,
} from '@/types/index';
import { formatAmount, regexImgUrl } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import { KLV_PRECISION } from '@/utils/globalVariables';
import {
  BoldElement,
  CenteredSubTitle,
  Container,
  CopyBackground,
  ElementsWrapper,
  HalfRow,
  LetterLogo,
  Logo,
  Rating,
  RatingContainer,
  ReceiveBackground,
  Row,
  Status,
  TitleContent,
  TitleInformation,
  ValidatorTitle,
} from '@/views/validator';
import {
  CardContainer,
  CardContent,
  CenteredRow,
  TableContainer,
} from '@/views/validators/detail';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IoIosInfinite } from 'react-icons/io';

interface IValidatorPage {
  validator: IPeer;
  delegators: IBucket[];
  pagination: IPagination;
}

interface IValidatorResponse extends IResponse {
  data: {
    validator: IPeer;
  };
  pagination: IPagination;
}

interface IDelegateResponse extends IResponse {
  data: {
    delegators: IDelegate[];
  };
  pagination: IPagination;
}

const DynamicValidatorCards = dynamic(
  () => import('../../components/ValidatorCards'),
);

const Validator: React.FC<IValidatorPage> = () => {
  const router = useRouter();
  const [validator, setValidator] = useState<null | IPeer>(null);
  const [imgError, setImgError] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const requestValidator = async () => {
        const res = await api.get({
          route: `validator/${router.query.hash}`,
        });
        if (!res.error || res.error === '') {
          setValidator(res.data.validator);
        }
      };
      requestValidator();
    }
  }, [router.isReady]);

  const handleLogoError = () => {
    setImgError(true);
    setRerender(!rerender);
  };

  const renderLogo = () => {
    if (validator) {
      if (regexImgUrl(validator.logo) && !imgError) {
        return (
          <Logo
            alt={`${validator.name}-logo`}
            src={validator.logo}
            onError={() => handleLogoError()}
          />
        );
      }
      return <LetterLogo>{validator.name?.split?.('')[0] || 'K'}</LetterLogo>;
    }
    return null;
  };

  const totalProduced =
    (validator?.totalLeaderSuccessRate?.numSuccess || 0) +
    (validator?.totalValidatorSuccessRate?.numSuccess || 0);
  const totalMissed =
    (validator?.totalLeaderSuccessRate?.numFailure || 0) +
    (validator?.totalValidatorSuccessRate?.numFailure || 0);
  const DelegateIcon = getStatusIcon(
    validator?.canDelegate ? 'success' : 'fail',
  );

  const commissionPercent = (validator?.commission || 0) / 10 ** 2;

  const getListStatus = (list: string): string => {
    let status = '';
    switch (list) {
      case 'elected':
      case 'eligible':
        return (status = 'success');
      case 'waiting':
        return (status = 'pending');
      case 'leaving':
      case 'inactive':
      case 'observer':
        return (status = 'inactive');
      case 'jailed':
        return (status = 'fail');
    }
    return status;
  };

  const ListIcon = getStatusIcon(getListStatus(validator?.list || ''));

  const getRateColor = (): string => {
    const percent = (validator?.rating || 0) / 10 ** 7;

    if (percent > 0.8) {
      return 'green';
    } else if (percent > 0.5) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  const { isMobile } = useMobile();
  const renderTitle = () => {
    return (
      <h1>
        {validator?.name ||
          (isMobile
            ? parseAddress((router.query.hash as string) || '', 14)
            : parseAddress((router.query.hash as string) || '', 24))}
      </h1>
    );
  };

  const renderMaxDelegation = () => {
    const maxDelegationWithPresicion = (
      (validator?.maxDelegation || 0) /
      10 ** KLV_PRECISION
    ).toLocaleString();
    return (
      <p>
        {validator?.maxDelegation !== 0 ? (
          `${maxDelegationWithPresicion} KLV`
        ) : (
          <IoIosInfinite />
        )}
      </p>
    );
  };

  const requestValidatorDelegations = async (page: number, limit: number) => {
    const response: IDelegateResponse = await api.get({
      route: `validator/delegated/${router.query.hash}?page=${page}&limit=${limit}`,
    });

    const delegators: IBucket[] = [];
    response?.data?.delegators?.forEach(delegation => {
      delegation?.buckets?.forEach(bucket => {
        if (bucket?.delegation === router.query.hash) {
          delegators.push({
            address: delegation?.address,
            ...bucket,
          });
        }
      });
    });
    return { ...response, data: { validator: delegators } };
  };

  const Overview: React.FC = () => {
    return (
      <CardContent>
        <Row>
          <span>
            <strong>Owner Address</strong>
          </span>
          <span>
            <CenteredRow>
              {router.query.hash ? (
                <>
                  <Link href={`/account/${router.query.hash}`}>
                    {router.query.hash}
                  </Link>
                  <Copy
                    data={router.query.hash as string}
                    info="ownerAddress"
                  ></Copy>
                </>
              ) : (
                <Skeleton />
              )}
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <RatingContainer>
            <span>
              <strong>Rating</strong>
            </span>
            <span>
              {validator ? (
                <Rating rate={getRateColor()}>
                  {((validator?.rating * 100) / 10000000).toFixed(2)}%
                </Rating>
              ) : (
                <Skeleton />
              )}
            </span>
          </RatingContainer>
        </Row>
        <Row>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Status</strong>
              </span>
              {validator ? (
                <Status status={getListStatus(validator?.list)}>
                  <ListIcon />
                  <span>{validator?.list}</span>
                </Status>
              ) : (
                <Skeleton />
              )}
            </ElementsWrapper>
          </HalfRow>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Can Delegate</strong>
              </span>
              {validator ? (
                <Status status={validator.canDelegate ? 'success' : 'fail'}>
                  <DelegateIcon />
                  <span>{validator.canDelegate ? 'Yes' : 'No'}</span>
                </Status>
              ) : (
                <Skeleton />
              )}
            </ElementsWrapper>
          </HalfRow>
        </Row>
        <Row>
          <span>
            <strong>Max Delegation</strong>
          </span>
          {validator ? (
            <BoldElement>{renderMaxDelegation()}</BoldElement>
          ) : (
            <Skeleton />
          )}
        </Row>
        <Row>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Staked Balance</strong>
              </span>
              {validator ? (
                <BoldElement>
                  <span>
                    {(
                      validator.totalStake /
                      10 ** KLV_PRECISION
                    ).toLocaleString()}
                  </span>
                  <span> KLV</span>
                </BoldElement>
              ) : (
                <Skeleton />
              )}
            </ElementsWrapper>
          </HalfRow>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Self Stake</strong>
              </span>
              {validator ? (
                <BoldElement>
                  <span>
                    {(validator?.selfStake || 0 / 10 ** 6).toLocaleString()}
                  </span>
                  <span> KLV</span>
                </BoldElement>
              ) : (
                <Skeleton />
              )}
            </ElementsWrapper>
          </HalfRow>
        </Row>
        <Row>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Total Produced</strong>
              </span>
              {validator ? (
                <BoldElement>
                  <p>{totalProduced?.toLocaleString()}</p>
                </BoldElement>
              ) : (
                <Skeleton />
              )}
            </ElementsWrapper>
          </HalfRow>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Total Missed</strong>
              </span>
              {validator ? (
                <BoldElement>
                  <p>{totalMissed?.toLocaleString()}</p>
                </BoldElement>
              ) : (
                <Skeleton />
              )}
            </ElementsWrapper>
          </HalfRow>
        </Row>
        <Row>
          <ElementsWrapper>
            <span>
              <strong>Commission</strong>
            </span>
            {validator ? (
              <BoldElement>
                <p>{commissionPercent}%</p>
              </BoldElement>
            ) : (
              <Skeleton />
            )}
          </ElementsWrapper>
        </Row>
        <Row>
          <span>
            <strong>URIS</strong>
          </span>
          {validator ? (
            <BoldElement>
              <Dropdown uris={validator.uris} />
            </BoldElement>
          ) : (
            <Skeleton />
          )}
        </Row>
      </CardContent>
    );
  };

  const header = ['Address', 'Bucket ID', 'Staked Epoch', 'Amount '];

  const rowSections = (bucket: IBucket): IRowSection[] => {
    const { address, id, stakedEpoch, balance } = bucket;
    const sections = [
      {
        element: (
          <CenteredRow key={id}>
            <Link href={`/account/${address}`} key={address}>
              {parseAddress(address || '', 24)}
            </Link>
            <Copy data={address} info="address"></Copy>
          </CenteredRow>
        ),
        span: 2,
      },
      {
        element: (
          <CenteredRow key={id}>
            {parseAddress(id || '', 24)}
            <Copy data={id} info="id"></Copy>
          </CenteredRow>
        ),
        span: 2,
      },
      { element: <span key={stakedEpoch}>{stakedEpoch}</span>, span: 1 },
      {
        element: (
          <strong key={balance}>
            {formatAmount(balance / 10 ** KLV_PRECISION)}
          </strong>
        ),
        span: 1,
      },
    ];

    return sections;
  };

  const tableProps: ITable = {
    type: 'validator',
    header,
    rowSections,
    request: (page, limit) => requestValidatorDelegations(page, limit),
    scrollUp: false,
    dataName: 'validator',
  };

  return (
    <Container>
      <Title
        Component={() => (
          <TitleContent>
            {renderLogo()}
            <TitleInformation>
              <ValidatorTitle>{renderTitle()}</ValidatorTitle>
              {validator ? (
                <CenteredSubTitle>
                  <span>{validator?.blsPublicKey}</span>
                  <CopyBackground>
                    <Copy data={validator?.blsPublicKey} info="Key" />
                  </CopyBackground>
                  <ReceiveBackground isOverflow={false}>
                    <QrCodeModal
                      value={validator?.blsPublicKey || ''}
                      isOverflow={false}
                    />
                  </ReceiveBackground>
                </CenteredSubTitle>
              ) : (
                <Skeleton />
              )}
            </TitleInformation>
          </TitleContent>
        )}
        route={'/validators'}
      />

      <DynamicValidatorCards
        totalStake={validator?.totalStake}
        commission={validator?.commission}
        maxDelegation={validator?.maxDelegation}
      />
      <CardContainer>
        <Overview />
      </CardContainer>
      <TableContainer>
        <h3>List of delegations</h3>
        <Table {...tableProps} />
      </TableContainer>
    </Container>
  );
};

export default Validator;
