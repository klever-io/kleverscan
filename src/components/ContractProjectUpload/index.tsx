import React, { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import DropFileCard from '@/components/DropFileCard';
import DependencyVersionFields from '@/components/DependencyVersionFields';
import { InlineLoader } from '@/components/Loader';
import { readBuildVersionsFromZip } from '@/utils/contractValidator/abiVersions';
import { Fields, FileField, StatusText } from './styles';

interface ContractProjectUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  kscVersion: string;
  onKscVersionChange: (value: string) => void;
  rustVersion: string;
  onRustVersionChange: (value: string) => void;
  wasmOptVersion: string;
  onWasmOptVersionChange: (value: string) => void;
  // Prefix for element ids so two instances never collide on the same page.
  idPrefix?: string;
  // Caller-specific footer (submit button, hide-source checkbox, fee notes, …),
  // revealed together with the version fields once a project zip is selected.
  children?: React.ReactNode;
}

// ContractProjectUpload is the shared "upload a project and set its build
// versions" form body, used by both the paid contract-validator page and the
// owner Verify Contract tab. It owns the drag-and-drop zip selection, reads and
// auto-fills the ksc/rust versions from the zip's ABI (showing a parsing state),
// then conditionally reveals the version inputs and the caller's footer. The
// version values live in the parent (each flow submits them differently), so
// they are passed in controlled; this component only drives file selection and
// the ABI autofill.
const ContractProjectUpload: React.FC<ContractProjectUploadProps> = ({
  file,
  onFileChange,
  kscVersion,
  onKscVersionChange,
  rustVersion,
  onRustVersionChange,
  wasmOptVersion,
  onWasmOptVersionChange,
  idPrefix = 'upload',
  children,
}) => {
  const { t } = useTranslation('contractValidator');
  const [parsing, setParsing] = useState(false);
  // Tracks the latest file selection so a slower parse of an earlier file can't
  // overwrite the versions of a more recently selected one.
  const parseRequestIdRef = useRef(0);

  const handleFileSelected = async (selected: File | null): Promise<void> => {
    const requestId = ++parseRequestIdRef.current;
    onFileChange(selected);
    // Clear the auto-filled ksc/rust so a new zip without build metadata can't
    // keep a previous zip's values. wasm-opt is manual, so it is left untouched.
    onKscVersionChange('');
    onRustVersionChange('');
    if (!selected) return;
    setParsing(true);
    try {
      const versions = await readBuildVersionsFromZip(selected);
      // Ignore results if a newer file was selected while parsing.
      if (requestId !== parseRequestIdRef.current) return;
      if (versions?.kscVersion) onKscVersionChange(versions.kscVersion);
      if (versions?.rustVersion) onRustVersionChange(versions.rustVersion);
    } finally {
      if (requestId === parseRequestIdRef.current) setParsing(false);
    }
  };

  return (
    <>
      <FileField>
        <label>{t('projectZip')}</label>
        <DropFileCard
          id={`${idPrefix}-file`}
          accept=".zip"
          message={
            file ? t('fileSelected', { name: file.name }) : t('dropMessage')
          }
          onChange={e => handleFileSelected(e.target.files?.[0] ?? null)}
        />
        <small>{t('versionsAutofillHint')}</small>
      </FileField>

      {file && parsing && (
        <StatusText>
          <InlineLoader />
          {t('parsingVersions')}
        </StatusText>
      )}

      {file && !parsing && (
        <Fields>
          <DependencyVersionFields
            kscVersion={kscVersion}
            onKscVersionChange={onKscVersionChange}
            rustVersion={rustVersion}
            onRustVersionChange={onRustVersionChange}
            wasmOptVersion={wasmOptVersion}
            onWasmOptVersionChange={onWasmOptVersionChange}
            idPrefix={idPrefix}
          />
          {children}
        </Fields>
      )}
    </>
  );
};

export default ContractProjectUpload;
