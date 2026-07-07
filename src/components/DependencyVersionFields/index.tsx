import React from 'react';
import { useTranslation } from 'next-i18next';
import Tooltip from '@/components/Tooltip';
import { FieldRow, FormField, LabelRow } from './styles';

interface DependencyVersionFieldsProps {
  kscVersion: string;
  onKscVersionChange: (value: string) => void;
  rustVersion: string;
  onRustVersionChange: (value: string) => void;
  wasmOptVersion: string;
  onWasmOptVersionChange: (value: string) => void;
  // Prefix for input ids so two instances never collide on the same page.
  idPrefix?: string;
}

// DependencyVersionFields renders the shared ksc / rust / wasm-opt version inputs
// used by both the paid contract-validator page and the owner Verify Contract tab.
// It is fully controlled: each value + change handler is supplied by the parent.
// Labels, tooltips and hints come from the `contractValidator` i18n namespace, so
// any host page must load it in serverSideTranslations. Tooltip help text uses
// newlines, which the Tooltip component renders as separate lines.
const DependencyVersionFields: React.FC<DependencyVersionFieldsProps> = ({
  kscVersion,
  onKscVersionChange,
  rustVersion,
  onRustVersionChange,
  wasmOptVersion,
  onWasmOptVersionChange,
  idPrefix = 'dep',
}) => {
  const { t } = useTranslation('contractValidator');

  return (
    <FieldRow>
      <FormField>
        <LabelRow>
          <label htmlFor={`${idPrefix}-ksc-version`}>{t('kscVersion')}</label>
          <Tooltip msg={t('kscVersionTooltip')} />
        </LabelRow>
        <input
          id={`${idPrefix}-ksc-version`}
          type="text"
          value={kscVersion}
          onChange={e => onKscVersionChange(e.target.value)}
          placeholder="e.g. 0.45.0"
          spellCheck={false}
        />
        <small>{t('versionFieldAutofillHint')}</small>
      </FormField>

      <FormField>
        <LabelRow>
          <label htmlFor={`${idPrefix}-rust-version`}>{t('rustVersion')}</label>
          <Tooltip msg={t('rustVersionTooltip')} />
        </LabelRow>
        <input
          id={`${idPrefix}-rust-version`}
          type="text"
          value={rustVersion}
          onChange={e => onRustVersionChange(e.target.value)}
          placeholder="e.g. 1.90.0"
          spellCheck={false}
        />
        <small>{t('versionFieldAutofillHint')}</small>
      </FormField>

      <FormField>
        <LabelRow>
          <label htmlFor={`${idPrefix}-wasm-opt-version`}>
            {t('wasmOptVersion')}
          </label>
          <Tooltip msg={t('wasmOptVersionTooltip')} />
        </LabelRow>
        <input
          id={`${idPrefix}-wasm-opt-version`}
          type="text"
          value={wasmOptVersion}
          onChange={e => onWasmOptVersionChange(e.target.value)}
          placeholder="e.g. 116 (optional)"
          spellCheck={false}
        />
        <small>{t('wasmOptVersionFieldHint')}</small>
      </FormField>
    </FieldRow>
  );
};

export default DependencyVersionFields;
