import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextDecoder, TextEncoder } from 'util';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import type { AuditReport } from '@/types/smart-contract';

Object.assign(global, { TextEncoder, TextDecoder });
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom');
  const client = jest.requireActual('react-dom/client');
  const React = jest.requireActual('react');
  const roots = new Map<Element, { render: (ui: React.ReactNode) => void; unmount: () => void }>();
  return {
    ...actual,
    render: (ui: React.ReactNode, container: Element) => {
      let root = roots.get(container);
      if (!root) {
        root = client.createRoot(container);
        roots.set(container, root);
      }
      React.act(() => { root!.render(ui); });
      return root;
    },
    unmountComponentAtNode: (container: Element) => {
      const root = roots.get(container);
      if (!root) return false;
      React.act(() => { root.unmount(); });
      roots.delete(container);
      return true;
    },
  };
});

jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: () => <div data-testid="monaco-editor" />,
}));

jest.mock('react-syntax-highlighter', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <pre>{children}</pre>,
}));

jest.mock('react-syntax-highlighter/dist/cjs/styles/hljs', () => ({
  dracula: {},
  xcode: {},
}));

import { ContractAuditsTab } from '../index';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const makeReport = (overrides: Partial<AuditReport> = {}): AuditReport => ({
  id: 1,
  txHash: 'a'.repeat(64),
  link: 'https://audit.example.com/report',
  label: 'Audited by XYZ Security',
  submittedAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
  ...overrides,
});

describe('ContractAuditsTab', () => {
  it('shows empty state when no audit reports exist', () => {
    renderWithTheme(<ContractAuditsTab auditReports={[]} />);
    expect(
      screen.getByText(/No security audit reports have been submitted/i),
    ).toBeInTheDocument();
  });

  it('renders an audit report label', () => {
    const report = makeReport({ label: 'Audited by XYZ Security' });
    renderWithTheme(<ContractAuditsTab auditReports={[report]} />);
    expect(screen.getByText('Audited by XYZ Security')).toBeInTheDocument();
  });

  it('renders reports grouped under "Other versions" when txHash is not in scData', () => {
    const report = makeReport({ txHash: 'b'.repeat(64), label: 'Solo Audit' });
    renderWithTheme(<ContractAuditsTab auditReports={[report]} />);
    expect(screen.getByText('Other versions')).toBeInTheDocument();
    expect(screen.getByText('Solo Audit')).toBeInTheDocument();
  });

  it('renders reports under the matching version label when scData is provided', () => {
    const txHash = 'c'.repeat(64);
    const report = makeReport({ txHash, label: 'Deploy Audit' });
    const scData = {
      deployTxHash: txHash,
      timestamp: 1700000000,
      upgrades: [],
    } as any;
    renderWithTheme(<ContractAuditsTab auditReports={[report]} scData={scData} />);
    expect(screen.getByText('Deploy Audit')).toBeInTheDocument();
    expect(screen.queryByText('Other versions')).not.toBeInTheDocument();
  });
});
