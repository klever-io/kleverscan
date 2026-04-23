import {
  fetchSourceFiles,
  submitValidation,
} from '@/services/requests/contractValidator';
import {
  ContractInfo,
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
  useRef,
  useState,
} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula, xcode } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { toast } from 'react-toastify';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import {
  StatusBadge,
  VerificationBadge,
  UploadCard,
  FormField,
  SubmitButton,
  JobStatusCard,
  JobRow,
  ErrorBox,
  CodeBlockWrapper,
  FileTab,
  FileTabs,
  SourceSection,
  SourceToolbar,
  SelectorGroup,
  SelectorLabel,
  EmptyState,
  Spinner,
  IdeLayout,
  IdeSidebar,
  IdeSidebarTitle,
  IdeFolder,
  IdeFolderHeader,
  IdeFileItem,
  IdeFileIcon,
  IdeEditorPane,
  IdeEditorTabBar,
  IdeEditorTab,
} from './styles';
import Tooltip from '@/components/Tooltip';
import SelectorDropdown from './SelectorDropdown';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

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
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('contractSourceViewMode');
    return saved === 'ide' || saved === 'tabs' ? saved : 'tabs';
  });

  const { data: sourceFiles, isLoading } = useQuery({
    queryKey: ['sourceFiles', contractAddress, selectedVersion],
    queryFn: () => fetchSourceFiles(contractAddress, selectedVersion),
    enabled: versions.length > 0,
  });

  const fileNames = sourceFiles ? Object.keys(sourceFiles).sort() : [];
  const activeFile = selectedFile || fileNames[0] || '';
  const abiVersion = versions.find(v => v.version === selectedVersion);

  // For IDE mode: all viewable files (source + ABI) in one list
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

  // Determine what's shown in IDE mode
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
              localStorage.setItem('contractSourceViewMode', mode);
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
    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitValidation(contractAddress, file, kscVersion, rustVersion);
      toast.success('Validation queued successfully');
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
      if (err.cause) setSubmitError(err.cause);
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
