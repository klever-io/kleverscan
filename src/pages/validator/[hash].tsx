import { PropsWithChildren } from 'react';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Dropdown from '@/components/Dropdown';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Table, { ITable } from '@/components/Table';
import { useContractModal } from '@/contexts/contractModal';
import { useExtension } from '@/contexts/extension';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CenteredRow,
  Container,
} from '@/styles/common';
import {
  IBucket,
  IDelegate,
  IPagination,
  IPeer,
  IResponse,
  IRowSection,
} from '@/types/index';
import { formatAmount, regexImgUrl } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { NextImageWrapper } from '@/views/home';
import {
  BoldElement,
  CenteredSubTitle,
  CopyBackground,
  ElementsWrapper,
  HalfRow,
  InteractionsValidatorContainer,
  LetterLogo,
  Rating,
  RatingContainer,
  ReceiveBackground,
  Row,
  Status,
  TitleContent,
  TitleInformation,
  ValidatorTitle,
} from '@/views/validator';
import { CardContainer, TableContainer } from '@/views/validators/detail';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IoIosInfinite } from 'react-icons/io';
import nextI18nextConfig from '../../../next-i18next.config';

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

const Validator: React.FC<PropsWithChildren<IValidatorPage>> = () => {
  const { t } = useTranslation(['validators', 'common']);
  const router = useRouter();
  const [validator, setValidator] = useState<null | IPeer>(null);
  const [imgError, setImgError] = useState(false);
  const [rerender, setRerender] = useState(false);

  const { extensionInstalled, walletAddress } = useExtension();

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
  };

  const renderLogo = () => {
    if (validator) {
      if (regexImgUrl(validator.logo) && !imgError) {
        return (
          <NextImageWrapper>
            <Image
              alt={`${validator.name}-logo`}
              width={50}
              height={50}
              style={{ borderRadius: '50%', border: '2px solid #ccc' }}
              src={validator.logo}
              onError={() => handleLogoError()}
              loader={({ src, width }) => `${src}?w=${width}`}
            />
          </NextImageWrapper>
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
    switch (list) {
      case 'elected':
      case 'eligible':
        return 'success';
      case 'waiting':
        return 'pending';
      case 'leaving':
      case 'inactive':
      case 'observer':
        return 'inactive';
      case 'jailed':
        return 'fail';
      default:
        return 'text';
    }
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

  const { isMobile, isTablet } = useMobile();
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

  const { getInteractionsButtons } = useContractModal();
  const [ConfigValidatorButton, UnjailValidatorButton] = getInteractionsButtons(
    [
      {
        title: 'Config Validator',
        contractType: 'ValidatorConfigContract',
      },
      {
        title: 'Unjail Validator',
        contractType: 'UnjailContract',
      },
    ],
  );

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
    if (router?.query?.hash) {
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
    }
    return {
      error: 'router.query not ready',
      code: 'fail',
      data: { validator: [] },
    };
  };

  const Overview: React.FC<PropsWithChildren> = () => {
    return (
      <CardContent>
        <Row>
          <span>
            <strong>{t('validators:OwnerAddress')}</strong>
          </span>
          <span>
            <CenteredRow>
              {router.query.hash ? (
                <>
                  <Link href={`/account/${router.query.hash}`} legacyBehavior>
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
              <strong>{t('validators:Rating')}</strong>
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
                <strong>{t('validators:Status')}</strong>
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
                <strong>{t('validators:CanDelegate')}</strong>
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
            <strong>{t('validators:MaxDelegation')}</strong>
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
                <strong>{t('validators:StakedBalance')}</strong>
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
                <strong>{t('validators:SelfStake')}</strong>
              </span>
              {validator ? (
                <BoldElement>
                  <span>
                    {((validator?.selfStake || 0) / 10 ** 6).toLocaleString()}
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
                <strong> {t('validators:TotalProduced')}</strong>
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
                <strong>{t('validators:TotalMissed')}</strong>
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
              <strong> {t('validators:Commission')}</strong>
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
    const sections: IRowSection[] = [
      {
        element: props => (
          <CenteredRow key={id}>
            <Link href={`/account/${address}`} key={address} legacyBehavior>
              {parseAddress(address || '', 24)}
            </Link>
            <Copy data={address} info="address"></Copy>
          </CenteredRow>
        ),
        span: 2,
      },
      {
        element: props => (
          <CenteredRow key={id}>
            {parseAddress(id || '', 24)}
            <Copy data={id} info="id"></Copy>
          </CenteredRow>
        ),
        span: 2,
      },
      {
        element: props => <span key={stakedEpoch}>{stakedEpoch}</span>,
        span: 1,
      },
      {
        element: props => (
          <span key={balance}>
            {formatAmount(balance / 10 ** KLV_PRECISION)}
          </span>
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
    dataName: 'validator',
  };

  const InteractionsButtonsComponenet: React.FC<PropsWithChildren> = () => {
    const routerAddress = router.query?.hash || '';
    if (!!extensionInstalled && routerAddress === walletAddress) {
      return (
        <InteractionsValidatorContainer>
          <ConfigValidatorButton />
          {validator?.list === 'jailed' && <UnjailValidatorButton />}
        </InteractionsValidatorContainer>
      );
    }

    return <></>;
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
              {!isMobile && <InteractionsButtonsComponenet />}
            </TitleInformation>
          </TitleContent>
        )}
        route={'/validators'}
      />
      {isMobile && <InteractionsButtonsComponenet />}

      <DynamicValidatorCards
        totalStake={validator?.totalStake}
        commission={validator?.commission}
        maxDelegation={validator?.maxDelegation}
      />
      <CardContainer>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>{t('common:Tabs.Overview')}</span>
          </CardHeaderItem>
        </CardHeader>
        <Overview />
      </CardContainer>
      <TableContainer>
        <h3>List of delegations</h3>
        <Table {...tableProps} />
      </TableContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'validators'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Validator;
