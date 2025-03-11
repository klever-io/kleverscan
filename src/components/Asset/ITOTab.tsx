import { PropsWithChildren } from 'react';
import { statusWithIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import { displayITOpacks } from '@/components/ITO';
import { useExtension } from '@/contexts/extension';
import { IParsedITO } from '@/types';
import { formatDate } from '@/utils/formatFunctions';
import {
  EllipsisSpan,
  ExpandableRow,
  ExpandWrapper,
  FrozenContainer,
  Row,
  WhiteListRow,
} from '@/views/assets/detail';
import { BalanceContainer, RowContent } from '@/views/proposals/detail';
import { ButtonExpand } from '@/views/transactions/detail';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { HashComponent } from '../Contract';

export interface ITOTabProps {
  ITO: IParsedITO | undefined;
}

export const ITOTab: React.FC<PropsWithChildren<ITOTabProps>> = ({ ITO }) => {
  const { extensionInstalled, connectExtension } = useExtension();
  const { t } = useTranslation('itos');
  const router = useRouter();
  const [expand, setExpand] = useState({ whitelist: false, packs: false });
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (extensionInstalled) {
      connectExtension();
    }
  }, [extensionInstalled]);
  return (
    <>
      {ITO && ITO.isActive ? (
        <>
          {ITO?.maxAmount ? (
            <Row span={2}>
              <span>
                <strong>{t('assets:ITO.Max Amount')}</strong>
              </span>
              <span>{ITO.maxAmount}</span>
            </Row>
          ) : null}
          <Row span={2}>
            <span>
              <strong>{t('assets:ITO.Receiver Address')}</strong>
            </span>
            <div>
              <span>{ITO.receiverAddress}</span>
              <Copy data={ITO.receiverAddress} />
            </div>
          </Row>
          <Row>
            <span>
              <strong>{t('assets:ITO.White List Active')}</strong>
            </span>
            <span>{statusWithIcon(ITO.isWhitelistActive, t)}</span>
          </Row>

          {ITO?.startTime && (
            <Row>
              <span>
                <strong>{t('assets:ITO.Start Time')}</strong>
              </span>
              <span>
                <small>{formatDate(ITO.startTime)}</small>
              </span>
            </Row>
          )}
          {ITO?.endTime && (
            <Row>
              <span>
                <strong>{t('assets:ITO.End Time')}</strong>
              </span>
              <span>
                <small>{formatDate(ITO.endTime)}</small>
              </span>
            </Row>
          )}
          {ITO?.whitelistStartTime && (
            <Row>
              <span>
                <strong>{t('assets:ITO.White List')}</strong>
                <br />
                <strong>{t('assets:ITO.Start Time')}</strong>
              </span>
              <span>
                <small>{formatDate(ITO.whitelistStartTime)}</small>
              </span>
            </Row>
          )}
          {ITO?.whitelistEndTime && (
            <Row span={2}>
              <span>
                <strong>{t('assets:ITO.White List')}</strong>
                <br />
                <strong>{t('assets:ITO.End Time')}</strong>
              </span>
              <span>
                <small>{formatDate(ITO.whitelistEndTime)}</small>
              </span>
            </Row>
          )}
          {ITO?.whitelistInfo && (
            <WhiteListRow expandVar={expand.whitelist} span={2}>
              <ExpandWrapper expandVar={expand.whitelist}>
                <span style={{ gap: '4px' }}>
                  <strong>{t('assets:ITO.White List Info')}</strong>
                </span>
                <span>
                  <ButtonExpand
                    style={{ display: 'inline' }}
                    onClick={() =>
                      setExpand({ ...expand, whitelist: !expand.whitelist })
                    }
                  >
                    {expand.whitelist
                      ? `${t('common:Buttons.Hide')}`
                      : `${t('common:Buttons.Expand')}`}
                  </ButtonExpand>
                </span>
              </ExpandWrapper>
              {expand.whitelist && (
                <div style={{ minWidth: 0, width: '100%' }}>
                  {ITO.whitelistInfo.map((data, index) => {
                    return (
                      <RowContent key={index}>
                        <BalanceContainer>
                          <FrozenContainer>
                            <div
                              style={{
                                width: '100%',
                                overflow: 'visible',
                              }}
                            >
                              <span>
                                <strong>{t('table:Address')}</strong>
                              </span>
                              <EllipsisSpan>
                                <Link
                                  href={`/accounts/${data.address}`}
                                  legacyBehavior
                                >
                                  {data.address}
                                </Link>
                                <Copy data={data.address} />
                              </EllipsisSpan>
                            </div>
                            <div>
                              <span>
                                <strong>{t('table:Limit')}</strong>
                              </span>
                              <span>
                                <small>{data.limit}</small>
                              </span>
                            </div>
                          </FrozenContainer>
                        </BalanceContainer>
                      </RowContent>
                    );
                  })}
                </div>
              )}
            </WhiteListRow>
          )}
          {ITO.packData && (
            <ExpandableRow expandVar={expand.packs} span={2}>
              {txHash && <HashComponent hash={txHash} setHash={setTxHash} />}
              <ExpandWrapper
                expandVar={expand.packs}
                style={{ marginBottom: expand.packs ? '1rem' : '0' }}
              >
                <span style={{ gap: '4px' }}>
                  <strong>{t('assets:ITO.Packs Data')}</strong>
                </span>
                <span>
                  {' '}
                  <ButtonExpand
                    onClick={() => {
                      setExpand({ ...expand, packs: !expand.packs });
                    }}
                  >
                    {expand.packs
                      ? `${t('common:Buttons.Hide')}`
                      : `${t('common:Buttons.Expand')}`}
                  </ButtonExpand>
                </span>
              </ExpandWrapper>
              {expand.packs && displayITOpacks(ITO, setTxHash, t)}
            </ExpandableRow>
          )}
        </>
      ) : (
        <Row>
          <p>No active ITO found</p>
        </Row>
      )}
    </>
  );
};
