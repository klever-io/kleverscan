import {
  fetchSourceFiles,
  submitValidation,
} from '@/services/requests/contractValidator';
import {
  AuditReport,
  ContractInfo,
  ContractVersion,
  SmartContractDetailsData,
  ValidationJob,
  ValidationJobStatus,
} from '@/types/smart-contract';
import { useQuery } from '@tanstack/react-query';
import { ThemeContext } from '@/contexts/theme';
import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula, xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { toast } from 'react-toastify';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import {
  AuditLinkButton,
  AuditLinkModalButtons,
  AuditLinkModalContent,
  AuditLinkModalOverlay,
  AuditLinkModalTitle,
  AuditReportDate,
  AuditReportLabel,
  AuditReportList,
  AuditReportRow,
  AuditSection,
  AuditSectionTitle,
  CodeBlockWrapper,
  EmptyState,
  ErrorBox,
  FeeInfo,
  FileTab,
  FileTabs,
  FormField,
  IdeEditorPane,
  IdeEditorTab,
  IdeEditorTabBar,
  IdeFileIcon,
  IdeFileItem,
  IdeFolder,
  IdeFolderHeader,
  IdeLayout,
  IdeSidebar,
  IdeSidebarTitle,
  JobRow,
  JobStatusCard,
  ModalCancelButton,
  SelectorGroup,
  SelectorLabel,
  SourceSection,
  SourceToolbar,
  Spinner,
  StatusBadge,
  SubmitButton,
  UploadCard,
  VerificationBadge,
} from './styles';
import Tooltip from '@/components/Tooltip';
import SelectorDropdown from './SelectorDropdown';
import { buildBlockchainVersions, isSafeUrl } from './utils';
import { useAuditSubmission } from '@/utils/hooks/auditSubmission';
import { IoOpenOutline } from 'react-icons/io5';
import { useExtension } from '@/contexts/extension';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

function ExternalLinkConfirmModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AuditLinkModalOverlay onClick={onClose}>
      <AuditLinkModalContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="ext-link-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <AuditLinkModalTitle id="ext-link-modal-title">
          External Link Warning
        </AuditLinkModalTitle>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          This link has not been verified by Klever. External links may be
          harmful — proceed with caution.
        </p>
        <AuditLinkModalButtons>
          <ModalCancelButton type="button" onClick={onClose}>
            Cancel
          </ModalCancelButton>
          <SubmitButton
            type="button"
            onClick={() => {
              window.open(url, '_blank', 'noopener,noreferrer');
              onClose();
            }}
          >
            Open Link
          </SubmitButton>
        </AuditLinkModalButtons>
      </AuditLinkModalContent>
    </AuditLinkModalOverlay>
  );
}

function AuditReportItem({
  report,
  isPrimary,
  onOpenLink,
}: {
  report: AuditReport;
  isPrimary: boolean;
  onOpenLink: (url: string) => void;
}) {
  return (
    <AuditReportRow>
      <AuditReportLabel>
        {isPrimary ? <strong>{report.label}</strong> : report.label}
      </AuditReportLabel>
      {isSafeUrl(report.link) && (
        <AuditLinkButton onClick={() => onOpenLink(report.link)}>
          View Report <IoOpenOutline size={20} />
        </AuditLinkButton>
      )}
      <AuditReportDate>
        {new Date(report.submittedAt).toLocaleDateString()}
      </AuditReportDate>
    </AuditReportRow>
  );
}

type ViewMode = 'tabs' | 'ide';

// --- Tab content: Source viewer (all users) ---

export function ContractSourceTab({
  contractAddress,
  contractInfo,
}: {
  contractAddress: string;
  contractInfo: ContractInfo;
}) {
  const { isDarkTheme } = useContext(ThemeContext);
  const highlighterStyle = isDarkTheme ? dracula : xcode;
  const versions = contractInfo.contractVersions ?? [];
  const latestVersion = versions[versions.length - 1]?.version ?? 1;
  const [selectedVersion, setSelectedVersion] = useState(latestVersion);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'source' | 'abi'>('source');
  const [viewMode, setViewMode] = useState<ViewMode>('tabs');

  const { data: sourceFiles, isLoading } = useQuery({
    queryKey: ['sourceFiles', contractAddress, selectedVersion],
    queryFn: () => fetchSourceFiles(contractAddress, selectedVersion),
    enabled: versions.length > 0,
  });

  const fileNames = sourceFiles ? Object.keys(sourceFiles).sort() : [];
  const activeFile = selectedFile || fileNames[0] || '';
  const abiVersion = versions.find(v => v.version === selectedVersion);

  const abiContent = (() => {
    if (!abiVersion?.abi) return '';
    try {
      return JSON.stringify(JSON.parse(abiVersion.abi), null, 2);
    } catch {
      return abiVersion.abi;
    }
  })();
  const ideActiveFile = selectedFile || fileNames[0] || '';
  const [srcFolderOpen, setSrcFolderOpen] = useState(true);
  const [outputFolderOpen, setOutputFolderOpen] = useState(true);

  const ideSelectedIsAbi = ideActiveFile === '__abi__';
  const ideValue = ideSelectedIsAbi
    ? abiContent
    : (sourceFiles?.[ideActiveFile] ?? '');
  const ideLanguage = ideSelectedIsAbi ? 'json' : 'rust';
  const ideFileName = ideSelectedIsAbi ? 'abi.json' : ideActiveFile;

  const viewModeLabels: Record<ViewMode, string> = {
    tabs: 'File tabs',
    ide: 'IDE',
  };
  const versionOptions = [...versions].reverse().map(v => ({
    value: v.version,
    label: `v${v.version} — ${new Date(v.createdAt).toLocaleDateString()}`,
  }));
  const viewOptions = (['tabs', 'ide'] as ViewMode[]).map(mode => ({
    value: mode,
    label: viewModeLabels[mode],
  }));

  const selectIdeFile = (name: string) => {
    setSelectedFile(name);
    if (name === '__abi__') {
      setActiveTab('abi');
    } else {
      setActiveTab('source');
    }
  };

  const isLatestVersionSelected = selectedVersion === latestVersion;
  const showVerificationBadge =
    versions.length > 0 &&
    isLatestVersionSelected &&
    typeof contractInfo.sourceUpToDate === 'boolean';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem('contractSourceViewMode');
    if (saved === 'ide' || saved === 'tabs') {
      setViewMode(saved);
    }
  }, []);

  return (
    <SourceSection>
      <SourceToolbar>
        {versions.length > 1 && (
          <SelectorGroup>
            <SelectorLabel>Version</SelectorLabel>
            <SelectorDropdown
              value={selectedVersion}
              options={versionOptions}
              onChange={version => {
                setSelectedVersion(version);
                setSelectedFile('');
              }}
            />
          </SelectorGroup>
        )}

        {showVerificationBadge && (
          <SelectorGroup>
            <SelectorLabel>
              <span>Source Code Verified</span>
              <Tooltip
                msg={`This contract's deployed bytecode matches its submitted source code.\nSource code verification does not imply the contract is safe to interact with.`}
              />
            </SelectorLabel>
            <VerificationBadge verified={!!contractInfo.sourceUpToDate}>
              {contractInfo.sourceUpToDate ? (
                <>
                  <AiFillCheckCircle />
                  Verified
                </>
              ) : (
                <>
                  <AiFillExclamationCircle />
                  Outdated
                </>
              )}
            </VerificationBadge>
          </SelectorGroup>
        )}

        <SelectorGroup pushRight>
          <SelectorLabel>View</SelectorLabel>
          <SelectorDropdown
            value={viewMode}
            options={viewOptions}
            align="right"
            onChange={mode => {
              setViewMode(mode);
              if (typeof window !== 'undefined') {
                window.localStorage.setItem('contractSourceViewMode', mode);
              }
            }}
          />
        </SelectorGroup>
      </SourceToolbar>

      {viewMode === 'tabs' && (
        <>
          <FileTabs>
            <FileTab
              selected={activeTab === 'source'}
              onClick={() => setActiveTab('source')}
            >
              Source
            </FileTab>
            <FileTab
              selected={activeTab === 'abi'}
              onClick={() => setActiveTab('abi')}
            >
              ABI
            </FileTab>
          </FileTabs>

          {activeTab === 'source' && (
            <>
              {isLoading ? (
                <EmptyState>Loading source files...</EmptyState>
              ) : fileNames.length === 0 ? (
                <EmptyState>
                  No source files available for this version
                </EmptyState>
              ) : (
                <>
                  <FileTabs>
                    {fileNames.map(name => (
                      <FileTab
                        key={name}
                        selected={activeFile === name}
                        onClick={() => setSelectedFile(name)}
                      >
                        {name}
                      </FileTab>
                    ))}
                  </FileTabs>
                  <CodeBlockWrapper>
                    <SyntaxHighlighter
                      language="rust"
                      style={highlighterStyle}
                      showLineNumbers
                      wrapLongLines
                      customStyle={{
                        margin: 0,
                        borderRadius: '8px',
                        maxHeight: '500px',
                        fontSize: '0.8rem',
                      }}
                    >
                      {sourceFiles?.[activeFile] ?? ''}
                    </SyntaxHighlighter>
                  </CodeBlockWrapper>
                </>
              )}
            </>
          )}

          {activeTab === 'abi' && (
            <CodeBlockWrapper>
              <SyntaxHighlighter
                language="json"
                style={highlighterStyle}
                wrapLongLines
                customStyle={{
                  margin: 0,
                  borderRadius: '8px',
                  maxHeight: '500px',
                  fontSize: '0.8rem',
                }}
              >
                {abiContent || 'ABI not available'}
              </SyntaxHighlighter>
            </CodeBlockWrapper>
          )}
        </>
      )}

      {viewMode === 'ide' && (
        <>
          {isLoading ? (
            <EmptyState>Loading source files...</EmptyState>
          ) : (
            <IdeLayout>
              <IdeSidebar>
                <IdeSidebarTitle>Explorer</IdeSidebarTitle>

                <IdeFolder>
                  <IdeFolderHeader
                    open={srcFolderOpen}
                    onClick={() => setSrcFolderOpen(o => !o)}
                  >
                    src
                  </IdeFolderHeader>
                  {srcFolderOpen &&
                    fileNames.map(name => (
                      <IdeFileItem
                        key={name}
                        active={ideActiveFile === name}
                        onClick={() => selectIdeFile(name)}
                      >
                        <IdeFileIcon type="rust">&#9881;</IdeFileIcon>
                        {name}
                      </IdeFileItem>
                    ))}
                </IdeFolder>

                {abiContent && (
                  <IdeFolder>
                    <IdeFolderHeader
                      open={outputFolderOpen}
                      onClick={() => setOutputFolderOpen(o => !o)}
                    >
                      output
                    </IdeFolderHeader>
                    {outputFolderOpen && (
                      <IdeFileItem
                        active={ideSelectedIsAbi}
                        onClick={() => selectIdeFile('__abi__')}
                      >
                        <IdeFileIcon type="json">&#123;&#125;</IdeFileIcon>
                        abi.json
                      </IdeFileItem>
                    )}
                  </IdeFolder>
                )}
              </IdeSidebar>

              <IdeEditorPane>
                <IdeEditorTabBar>
                  {ideActiveFile && ideActiveFile !== '__abi__' && (
                    <IdeEditorTab active={!ideSelectedIsAbi} onClick={() => {}}>
                      <IdeFileIcon type="rust">&#9881;</IdeFileIcon>
                      {ideActiveFile}
                    </IdeEditorTab>
                  )}
                  {ideSelectedIsAbi && (
                    <IdeEditorTab active={ideSelectedIsAbi} onClick={() => {}}>
                      <IdeFileIcon type="json">&#123;&#125;</IdeFileIcon>
                      abi.json
                    </IdeEditorTab>
                  )}
                </IdeEditorTabBar>
                <Suspense fallback={<EmptyState>Loading editor...</EmptyState>}>
                  <MonacoEditor
                    height="100%"
                    language={ideLanguage}
                    theme={isDarkTheme ? 'vs-dark' : 'light'}
                    value={ideValue}
                    path={ideFileName}
                    options={{
                      readOnly: true,
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      fontSize: 13,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      domReadOnly: true,
                    }}
                  />
                </Suspense>
              </IdeEditorPane>
            </IdeLayout>
          )}
        </>
      )}
    </SourceSection>
  );
}

// --- Tab content: Verify contract (owner only) ---

export function ContractVerifyTab({
  contractAddress,
  latestJob,
  hasVerifiedVersions,
  onSubmitted,
}: {
  contractAddress: string;
  latestJob: ValidationJob | null;
  hasVerifiedVersions: boolean;
  onSubmitted: () => void;
}) {
  const [showUpload, setShowUpload] = useState(!hasVerifiedVersions);
  useEffect(() => {
    setShowUpload(!hasVerifiedVersions);
  }, [hasVerifiedVersions]);

  const activeJob =
    latestJob &&
    (latestJob.status === 'pending' ||
      latestJob.status === 'running' ||
      latestJob.status === 'failed')
      ? latestJob
      : null;

  return (
    <div>
      {activeJob && <JobStatusSection job={activeJob} />}

      {(!activeJob || activeJob.status === 'failed') && (
        <>
          {!showUpload && hasVerifiedVersions ? (
            <JobStatusCard>
              <SubmitButton type="button" onClick={() => setShowUpload(true)}>
                Upload new version
              </SubmitButton>
            </JobStatusCard>
          ) : (
            <UploadForm
              contractAddress={contractAddress}
              onSubmitted={() => {
                setShowUpload(false);
                onSubmitted();
              }}
            />
          )}
        </>
      )}

      {(activeJob?.status === 'pending' || activeJob?.status === 'running') && (
        <EmptyState>
          Validation in progress. This may take a few minutes...
        </EmptyState>
      )}
    </div>
  );
}

// --- Tab content: Submit audit report (owner only) ---

export function ContractSubmitAuditTab({
  contractAddress,
  contractInfo,
  scData,
  onSubmitted,
}: {
  contractAddress: string;
  contractInfo: ContractInfo | null;
  scData?: SmartContractDetailsData;
  onSubmitted: () => void;
}) {
  const versions = contractInfo?.contractVersions ?? [];
  const hasVerifiedVersions = versions.length > 0;
  const latestVersion = versions[versions.length - 1];

  const blockchainVersionOptions = useMemo(
    () =>
      buildBlockchainVersions(scData).map(v => ({
        value: v.txHash,
        label: v.label,
      })),
    [scData],
  );

  const [selectedVersionId, setSelectedVersionId] = useState<number>(
    latestVersion?.id ?? 0,
  );
  const [selectedTxHash, setSelectedTxHash] = useState<string>(
    () => blockchainVersionOptions[0]?.value ?? '',
  );

  const selectedVersion = versions.find(v => v.id === selectedVersionId);
  const currentAudit = selectedVersion?.auditReports
    ? ([...selectedVersion.auditReports].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      )[0] ?? null)
    : null;

  const versionTxHash = hasVerifiedVersions
    ? (selectedVersion?.transactionHash ?? '')
    : selectedTxHash;

  const {
    link,
    setLink,
    label,
    setLabel,
    submitting,
    submitError,
    transferValue,
    pendingExternalUrl,
    setPendingExternalUrl,
    handleSubmit,
  } = useAuditSubmission({
    contractAddress,
    currentAudit,
    onSubmitted,
    versionTxHash,
  });

  const { wallet } = useExtension();

  useEffect(() => {
    if (hasVerifiedVersions) {
      if (!versions.some(v => v.id === selectedVersionId)) {
        setSelectedVersionId(latestVersion?.id ?? 0);
      }
    } else if (!selectedTxHash && blockchainVersionOptions.length > 0) {
      setSelectedTxHash(blockchainVersionOptions[0].value);
    }
  }, [
    hasVerifiedVersions,
    latestVersion?.id,
    versions,
    selectedVersionId,
    selectedTxHash,
    blockchainVersionOptions,
  ]);

  const versionOptions = [...versions].reverse().map(v => ({
    value: v.id,
    label: `v${v.version} — ${new Date(v.createdAt).toLocaleDateString()}`,
  }));

  return (
    <>
      <form onSubmit={handleSubmit}>
        <UploadCard>
          <JobStatusCard style={{ padding: 0, marginBottom: '0.5rem' }}>
            {hasVerifiedVersions ? (
              <>
                {versions.length > 0 && (
                  <JobRow>
                    <strong>Version</strong>
                    <SelectorDropdown
                      value={selectedVersionId}
                      options={versionOptions}
                      onChange={id => setSelectedVersionId(id)}
                    />
                  </JobRow>
                )}
                {currentAudit && (
                  <JobRow>
                    <strong>Current</strong>
                    {isSafeUrl(currentAudit.link) && (
                      <AuditLinkButton
                        type="button"
                        onClick={() => setPendingExternalUrl(currentAudit.link)}
                      >
                        {currentAudit.label} ↗
                      </AuditLinkButton>
                    )}
                    <AuditReportDate>
                      {new Date(currentAudit.submittedAt).toLocaleDateString()}
                    </AuditReportDate>
                  </JobRow>
                )}
              </>
            ) : (
              <JobRow>
                <strong>Version</strong>
                {blockchainVersionOptions.length > 0 ? (
                  <SelectorDropdown
                    value={selectedTxHash}
                    options={blockchainVersionOptions}
                    onChange={hash => setSelectedTxHash(hash)}
                  />
                ) : (
                  <EmptyState style={{ padding: 0 }}>
                    Contract data not available
                  </EmptyState>
                )}
              </JobRow>
            )}
          </JobStatusCard>

          {submitError && <ErrorBox>{submitError}</ErrorBox>}
          <FormField>
            <label>Audit report URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={link}
              onChange={e => setLink(e.target.value)}
            />
          </FormField>
          <FormField>
            <label>Auditor / report name</label>
            <input
              type="text"
              placeholder="e.g. Audited by XYZ Security"
              value={label}
              onChange={e => setLabel(e.target.value)}
              maxLength={255}
            />
          </FormField>
          {transferValue != null && (
            <FeeInfo>
              Submitting requires a payment of <span>{transferValue} KLV</span>
            </FeeInfo>
          )}
          <SubmitButton type="submit" disabled={submitting || !wallet}>
            {!wallet
              ? 'Connect wallet to submit'
              : submitting
                ? 'Submitting...'
                : currentAudit
                  ? 'Update audit report'
                  : 'Submit audit report'}
          </SubmitButton>
        </UploadCard>
      </form>
      {pendingExternalUrl && (
        <ExternalLinkConfirmModal
          url={pendingExternalUrl}
          onClose={() => setPendingExternalUrl(null)}
        />
      )}
    </>
  );
}

// --- Tab content: Contract audits (all users) ---

export function ContractAuditsTab({
  auditReports,
  scData,
}: {
  auditReports: AuditReport[];
  scData?: SmartContractDetailsData;
}) {
  const [pendingExternalUrl, setPendingExternalUrl] = useState<string | null>(
    null,
  );

  const versionList = buildBlockchainVersions(scData);

  if (auditReports.length === 0) {
    return (
      <EmptyState>
        No security audit reports have been submitted for this contract.
      </EmptyState>
    );
  }

  const sorted = [...auditReports].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  const byTxHash = new Map<string, AuditReport[]>();
  for (const r of sorted) {
    const list = byTxHash.get(r.txHash) ?? [];
    list.push(r);
    byTxHash.set(r.txHash, list);
  }

  const versionsWithAudits = versionList.filter(v => byTxHash.has(v.txHash));
  const knownHashes = new Set(versionList.map(v => v.txHash));
  const unknownReports = sorted.filter(r => !knownHashes.has(r.txHash));

  return (
    <>
      {versionsWithAudits.map(v => (
        <AuditSection key={v.txHash}>
          <AuditSectionTitle>{v.label}</AuditSectionTitle>
          <AuditReportList>
            {(byTxHash.get(v.txHash) ?? []).map(
              (report: AuditReport, index: number) => (
                <AuditReportItem
                  key={report.id}
                  report={report}
                  isPrimary={index === 0}
                  onOpenLink={setPendingExternalUrl}
                />
              ),
            )}
          </AuditReportList>
        </AuditSection>
      ))}
      {unknownReports.length > 0 && (
        <AuditSection>
          <AuditSectionTitle>Other versions</AuditSectionTitle>
          <AuditReportList>
            {unknownReports.map((report: AuditReport, index: number) => (
              <AuditReportItem
                key={report.id}
                report={report}
                isPrimary={index === 0}
                onOpenLink={setPendingExternalUrl}
              />
            ))}
          </AuditReportList>
        </AuditSection>
      )}
      {pendingExternalUrl && (
        <ExternalLinkConfirmModal
          url={pendingExternalUrl}
          onClose={() => setPendingExternalUrl(null)}
        />
      )}
    </>
  );
}

// --- Internal sub-components ---

function UploadForm({
  contractAddress,
  onSubmitted,
}: {
  contractAddress: string;
  onSubmitted: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [kscVersion, setKscVersion] = useState('');
  const [rustVersion, setRustVersion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { wallet, walletAddress } = useExtension();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select a ZIP file');
      return;
    }
    if (!kscVersion.trim()) {
      toast.error('KSC version is required');
      return;
    }
    if (!wallet || !walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    let signature: string;
    try {
      const windowMs = 2 * 60 * 1000;
      const roundedTs = Math.floor(Date.now() / windowMs) * windowMs;
      const sigMessage = `Submit validation for contract ${contractAddress} at ${roundedTs}`;
      const sig = await wallet.signMessage(sigMessage);
      signature = sig.toBase64();
    } catch {
      setSubmitting(false);
      toast.error('Wallet signing was rejected or failed');
      return;
    }
    try {
      await submitValidation(
        contractAddress,
        file,
        kscVersion,
        rustVersion,
        walletAddress,
        signature,
      );
      toast.success('Validation queued successfully');
      onSubmitted();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      toast.error(message);
      if (err instanceof Error && err.cause)
        setSubmitError(err.cause as string);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <UploadCard>
        {submitError && <ErrorBox>{submitError}</ErrorBox>}
        <FormField>
          <label>Contract ZIP file</label>
          <input type="file" accept=".zip" ref={fileRef} />
          <small>Upload the Rust source project as a ZIP archive</small>
        </FormField>
        <FormField>
          <label>KSC version</label>
          <input
            type="text"
            placeholder="e.g. 1.0.0"
            value={kscVersion}
            onChange={e => setKscVersion(e.target.value)}
          />
        </FormField>
        <FormField>
          <label>Rust version (optional)</label>
          <input
            type="text"
            placeholder="e.g. 1.70.0"
            value={rustVersion}
            onChange={e => setRustVersion(e.target.value)}
          />
        </FormField>
        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit for verification'}
        </SubmitButton>
      </UploadCard>
    </form>
  );
}

function JobStatusSection({ job }: { job: ValidationJob }) {
  return (
    <JobStatusCard>
      <JobRow>
        <strong>Status</strong>
        <StatusBadge status={job.status}>
          {(job.status === 'pending' || job.status === 'running') && (
            <Spinner />
          )}
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </StatusBadge>
      </JobRow>
      <JobRow>
        <strong>KSC version</strong>
        <span>{job.kscVersion}</span>
      </JobRow>
      {job.rustVersion && (
        <JobRow>
          <strong>Rust version</strong>
          <span>{job.rustVersion}</span>
        </JobRow>
      )}
      <JobRow>
        <strong>Submitted</strong>
        <span>{new Date(job.createdAt).toLocaleString()}</span>
      </JobRow>
      {job.status === 'failed' && job.error && (
        <div>
          <strong style={{ fontSize: '0.875rem' }}>Error</strong>
          <ErrorBox>{job.error}</ErrorBox>
        </div>
      )}
    </JobStatusCard>
  );
}
