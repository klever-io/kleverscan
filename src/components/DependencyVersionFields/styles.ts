import styled from 'styled-components';

// Responsive row: the three version fields sit side by side on wide screens and
// wrap to a single column on narrow ones.
export const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;

  > * {
    flex: 1 1 220px;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.4rem;
  color: ${({ theme }) => theme.black};

  input[type='text'] {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${({ theme }) => theme.black20};
    border-radius: 8px;
    background: transparent;
    color: ${({ theme }) => theme.black};
    font-size: 0.875rem;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.violet};
    }
  }

  small {
    font-size: 0.75rem;
    opacity: 0.6;
  }
`;

// Label text plus the inline Tooltip help icon.
export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;

  label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .button-tooltip {
    display: inline-flex;
    align-items: center;
    cursor: help;
  }
`;
