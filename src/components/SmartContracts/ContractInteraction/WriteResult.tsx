import { HashComponent } from '@/components/Contract';
import ReturnData, { hasReturnData, ILogEvent } from '@/components/ReturnData';
import api from '@/services/api';
import { Service } from '@/types';
import { hexToUtf8 } from '@/utils/hex';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import {
  OutputRow,
  ResultBox,
  ResultContainer,
  ResultLabel,
  Spinner,
  StatusLine,
} from './styles';

type Phase = 'pending' | 'success' | 'fail' | 'timeout';

const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 40; // ~2 minutes before giving up and pointing at the explorer

const FAILURE_EVENTS = ['signalError', 'internalVMErrors'];
const FAILURE_STATUSES = ['fail', 'failed', 'invalid'];

// Returns the decoded on-chain error message, or '' when none is available (the
// caller substitutes a localized fallback). The message itself comes from the
// chain and is not translated.
const extractErrorMessage = (events: ILogEvent[]): string => {
  const errEvent = events.find(e => FAILURE_EVENTS.includes(e.identifier));
  if (!errEvent) return '';
  // Best-effort decode of the signalError message; falls back to raw hex when
  // the payload isn't printable text.
  return [...(errEvent.topics ?? []), ...(errEvent.data ?? [])]
    .filter((v): v is string => !!v && v !== '')
    .map(v => hexToUtf8(v, { printableAsciiOnly: true }))
    .join(' ');
};

interface WriteResultProps {
  hash: string;
  setHash: React.Dispatch<React.SetStateAction<string | null>>;
  // ABI output types of the called endpoint, used to infer the default
  // visualization of each return value.
  outputTypes?: string[];
}

// WriteResult polls a just-broadcast contract call until the node reports it
// on-chain, then shows its ReturnData rows (or a failure state). The hash link
// itself is rendered by the shared HashComponent; the loader here reflects real
// chain readiness (replacing the old fixed fake loader), and unsuccessful
// transactions surface an explicit failed state.
export function WriteResult({ hash, setHash, outputTypes }: WriteResultProps) {
  const { t } = useTranslation('smartContracts');
  const [phase, setPhase] = useState<Phase>('pending');
  const [events, setEvents] = useState<ILogEvent[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    setPhase('pending');
    setEvents([]);
    setErrorMsg(null);

    const scheduleNext = () => {
      if (cancelled) return;
      if (attempts >= MAX_ATTEMPTS) {
        setPhase('timeout');
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    const poll = async () => {
      attempts += 1;
      let res: any;
      try {
        res = await api.get({
          service: Service.NODE,
          route: `transaction/${hash}?withResults=true`,
        });
      } catch {
        scheduleNext();
        return;
      }
      if (cancelled) return;

      const tx = res?.data?.transaction;
      const status = String(tx?.status ?? '').toLowerCase();
      // Not mined yet (missing, errored, or still pending) → keep polling.
      if (!tx || res?.error || status === '' || status === 'pending') {
        scheduleNext();
        return;
      }

      const evs: ILogEvent[] = tx?.logs?.events ?? [];
      const failed =
        evs.some(e => FAILURE_EVENTS.includes(e.identifier)) ||
        FAILURE_STATUSES.includes(status);

      setEvents(evs);
      if (failed) {
        setErrorMsg(extractErrorMessage(evs));
        setPhase('fail');
      } else {
        setPhase('success');
      }
    };

    // Small initial delay: the tx is never mined instantly after broadcast.
    timer = setTimeout(poll, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hash]);

  return (
    <ResultContainer>
      <HashComponent hash={hash} setHash={setHash} />

      {phase === 'pending' && (
        <StatusLine tone="pending">
          <Spinner />
          {t(
            'ContractInteraction.status.pending',
            'Waiting for the transaction to be processed…',
          )}
        </StatusLine>
      )}

      {phase === 'timeout' && (
        <StatusLine tone="pending">
          {t(
            'ContractInteraction.status.timeout',
            'Still processing — open the transaction to see the result.',
          )}
        </StatusLine>
      )}

      {phase === 'success' && (
        <>
          <StatusLine tone="success">
            <AiFillCheckCircle size={16} />
            {t('ContractInteraction.status.success', 'Transaction successful')}
          </StatusLine>
          {hasReturnData(events) && (
            <OutputRow>
              <ResultLabel>
                {t('ContractInteraction.returnData', 'Return Data')}
              </ResultLabel>
              <ReturnData events={events} outputTypes={outputTypes} />
            </OutputRow>
          )}
        </>
      )}

      {phase === 'fail' && (
        <>
          <StatusLine tone="fail">
            <AiFillExclamationCircle size={16} />
            {t('ContractInteraction.status.failed', 'Transaction failed')}
          </StatusLine>
          <ResultBox isError>
            {errorMsg ||
              t(
                'ContractInteraction.status.notSuccessful',
                'The transaction was not successful.',
              )}
          </ResultBox>
        </>
      )}
    </ResultContainer>
  );
}

export default WriteResult;
