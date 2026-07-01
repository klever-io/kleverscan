import Copy from '@/components/Copy';
import DropFileCard from '@/components/DropFileCard';
import Title from '@/components/Layout/Title';
import { InlineLoader } from '@/components/Loader';
import { Container, Header } from '@/styles/common';
import { useContractCheck } from '@/utils/hooks/contractCheck';
import {
  Content,
  Description,
  FeeNote,
  FieldRow,
  Form,
  FormField,
  HistoryDate,
  HistoryHashRow,
  HistoryHashes,
  HistoryEmpty,
  HistoryItem,
  HistoryLeft,
  HistoryList,
  HistoryTitle,
  HistoryVersions,
  ModalActions,
  ModalBox,
  ModalOverlay,
  ModalPrimaryLink,
  ModalSecondaryButton,
  ModalText,
  ModalTitle,
  Panel,
  Pill,
  StatusText,
  SubmitButton,
} from '@/views/contract-validator/detail';
import { ValidationJob } from '@/types/smart-contract';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PropsWithChildren, useState } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';
import { parseAddress } from '@/utils/parseValues';
import ExplorerLink from '@/components/ExplorerLink';

interface CheckResult {
  matched?: boolean;
  onChainHash?: string;
  compiledHash?: string;
}

const parseResult = (raw?: string): CheckResult => {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as CheckResult;
  } catch {
    return {};
  }
};

const ContractValidator: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('contractValidator');
  const {
    contractAddress,
    setContractAddress,
    kscVersion,
    setKscVersion,
    rustVersion,
    setRustVersion,
    file,
    onFileSelected,
    feeKlv,
    submitting,
    statusText,
    parsing,
    isAddressValid,
    isOwner,
    handleCheck,
    walletAddress,
    history,
  } = useContractCheck();

  const addr = contractAddress.trim();
  // Show the owner disclaimer once per address (dismissible).
  const [ownerModalDismissedFor, setOwnerModalDismissedFor] = useState<
    string | null
  >(null);
  const showOwnerModal =
    isOwner && isAddressValid && ownerModalDismissedFor !== addr;

  const renderVerdict = (h: ValidationJob) => {
    if (h.status === 'completed') {
      return h.matched ? (
        <Pill tone="match">{t('match')}</Pill>
      ) : (
        <Pill tone="nomatch">{t('noMatch')}</Pill>
      );
    }
    if (h.status === 'failed') {
      return <Pill tone="failed">{t('failed')}</Pill>;
    }
    return (
      <Pill tone="pending">
        <InlineLoader />
        {h.status === 'running' ? t('running') : t('pending')}
      </Pill>
    );
  };

  return (
    <Container>
      <Header>
        <Title title={t('title')} />
      </Header>
      <Content>
        <Description>{t('description')}</Description>

        <Panel>
          <Form onSubmit={handleCheck}>
            <FormField>
              <label htmlFor="contract-address">{t('contractAddress')}</label>
              <input
                id="contract-address"
                type="text"
                value={contractAddress}
                onChange={e => setContractAddress(e.target.value)}
                placeholder="klv1..."
                spellCheck={false}
              />
              {contractAddress && !isAddressValid && (
                <small>{t('invalidAddress')}</small>
              )}
            </FormField>

            {isAddressValid && (
              <FormField>
                <label>{t('projectZip')}</label>
                <DropFileCard
                  id="check-file"
                  accept=".zip"
                  message={
                    file
                      ? t('fileSelected', { name: file.name })
                      : t('dropMessage')
                  }
                  onChange={e => onFileSelected(e.target.files?.[0] ?? null)}
                />
                <small>{t('versionsAutofillHint')}</small>
              </FormField>
            )}

            {file && parsing && (
              <StatusText>
                <InlineLoader />
                {t('parsingVersions')}
              </StatusText>
            )}

            {file && !parsing && (
              <>
                <FieldRow>
                  <FormField>
                    <label htmlFor="ksc-version">{t('kscVersion')}</label>
                    <input
                      id="ksc-version"
                      type="text"
                      value={kscVersion}
                      onChange={e => setKscVersion(e.target.value)}
                      placeholder="0.45.0"
                      spellCheck={false}
                    />
                  </FormField>
                  <FormField>
                    <label htmlFor="rust-version">{t('rustVersion')}</label>
                    <input
                      id="rust-version"
                      type="text"
                      value={rustVersion}
                      onChange={e => setRustVersion(e.target.value)}
                      placeholder="1.90.0"
                      spellCheck={false}
                    />
                  </FormField>
                </FieldRow>

                <SubmitButton
                  type="submit"
                  disabled={
                    submitting ||
                    !isAddressValid ||
                    !kscVersion.trim() ||
                    !rustVersion.trim() ||
                    !file
                  }
                >
                  {submitting ? t('processing') : t('validate')}
                </SubmitButton>

                {!walletAddress && <FeeNote>{t('connectWalletHint')}</FeeNote>}
                {feeKlv != null && (
                  <FeeNote>{t('feeNote', { fee: feeKlv })}</FeeNote>
                )}
              </>
            )}

            {statusText && (
              <StatusText>
                <InlineLoader />
                {statusText}
              </StatusText>
            )}
          </Form>
        </Panel>

        {showOwnerModal && (
          <ModalOverlay onClick={() => setOwnerModalDismissedFor(addr)}>
            <ModalBox onClick={e => e.stopPropagation()}>
              <ModalTitle>{t('ownerModalTitle')}</ModalTitle>
              <ModalText>{t('ownerModalText')}</ModalText>
              <ModalActions>
                <ModalPrimaryLink
                  href={`/smart-contract/${addr}?tab=Verify%20Contract`}
                >
                  {t('ownerModalGoToPage')}
                </ModalPrimaryLink>
                <ModalSecondaryButton
                  type="button"
                  onClick={() => setOwnerModalDismissedFor(addr)}
                >
                  {t('ownerModalContinue')}
                </ModalSecondaryButton>
              </ModalActions>
            </ModalBox>
          </ModalOverlay>
        )}

        {walletAddress && (
          <Panel>
            <HistoryTitle>{t('historyTitle')}</HistoryTitle>
            {history.length === 0 ? (
              <HistoryEmpty>{t('historyEmpty')}</HistoryEmpty>
            ) : (
              <HistoryList>
                {history.map(h => {
                  const hashes = parseResult(h.result);
                  return (
                    <HistoryItem key={h.id}>
                      <HistoryLeft>
                        <ExplorerLink
                          type="smart-contract"
                          value={h.contractAddress}
                          label={parseAddress(h.contractAddress, 25)}
                        />
                        <HistoryDate>
                          {h.fileName ? `${h.fileName} · ` : ''}
                          {new Date(h.createdAt).toLocaleString()}
                        </HistoryDate>
                        {(h.kscVersion || h.rustVersion) && (
                          <HistoryVersions>
                            {h.kscVersion && `KSC ${h.kscVersion}`}
                            {h.kscVersion && h.rustVersion ? ' · ' : ''}
                            {h.rustVersion && `Rust ${h.rustVersion}`}
                          </HistoryVersions>
                        )}
                      </HistoryLeft>
                      <HistoryHashes>
                        {hashes.onChainHash && (
                          <HistoryHashRow>
                            <strong>{t('onChainShort')}</strong>
                            <pre title={hashes.onChainHash}>
                              {parseAddress(hashes.onChainHash, 25)}
                            </pre>
                            <Copy
                              data={hashes.onChainHash}
                              info={t('onChainShort')}
                              svgSize={14}
                            />
                          </HistoryHashRow>
                        )}
                        {hashes.compiledHash && (
                          <HistoryHashRow>
                            <strong>{t('compiledShort')}</strong>
                            <pre title={hashes.compiledHash}>
                              {parseAddress(hashes.compiledHash, 25)}
                            </pre>
                            <Copy
                              data={hashes.compiledHash}
                              info={t('compiledShort')}
                              svgSize={14}
                            />
                          </HistoryHashRow>
                        )}
                      </HistoryHashes>
                      {renderVerdict(h)}
                    </HistoryItem>
                  );
                })}
              </HistoryList>
            )}
          </Panel>
        )}
      </Content>
    </Container>
  );
};

const isContractValidationEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CONTRACT_VALIDATION === 'true';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  if (!isContractValidationEnabled) {
    return { notFound: true };
  }

  const props = await serverSideTranslations(
    locale,
    ['contractValidator', 'common'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default ContractValidator;
