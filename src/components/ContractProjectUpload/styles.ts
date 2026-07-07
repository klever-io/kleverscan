import styled from 'styled-components';

// The zip drop area: label, DropFileCard and the autofill hint.
export const FileField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: ${({ theme }) => theme.black};

  label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  small {
    font-size: 0.75rem;
    opacity: 0.6;
  }
`;

// The "reading versions…" indicator shown while the zip is parsed.
export const StatusText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.black};
  opacity: 0.85;
`;

// Wraps the version fields and the caller-provided footer once a file is chosen.
export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;
