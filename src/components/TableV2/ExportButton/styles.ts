import styled from 'styled-components';

export const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  bottom: -1rem;
  right: 0;
  transform: translateY(100%);
  z-index: 1;
  display: none;
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  text-align: left;
  background-color: ${props => props.theme.true.white};
  border-radius: 0.25rem;

  ${props => props.open && `display: block;`}

  ::before {
    position: absolute;
    top: 0rem;
    right: 12px;
    z-index: -1;
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    content: '';
    border: 0.5rem solid ${props => props.theme.true.white};
    transform: translateY(-25%) rotate(135deg);
  }
`;

export const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  color: ${props => props.theme.true.black};
  font-weight: 400;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  text-decoration: none;
  &:hover {
    background-color: ${props => props.theme.lightGray};
  }
`;

export const OutsideContainer = styled.div`
  display: grid;
  place-items: center;

  width: 40px;
  height: 40px;

  background-color: ${props => props.theme.card.background};

  border-radius: 8px;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.violet};
  }
`;

export const ExportButtonContainer = styled.div<{ isJson?: boolean }>`
  position: relative;

  svg {
    transition: color 0.1s linear;
    color: ${props => props.theme.table.text};
    &:hover {
      color: ${props =>
        props.isJson ? props.theme.status.warning : props.theme.green};
    }
  }
`;

export const ExportProgressBar = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 5px;
  background-color: ${props => props.theme.purple};
  transition: width 0.1s linear;
`;

export const ExportProgressContainer = styled.div`
  background-color: ${props => props.theme.gray};
  width: 100%;
`;
export const ExportProgressText = styled.p`
  color: ${props => props.theme.true.black};
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  margin: 0;
  padding: 0.5rem;
  text-align: center;
`;
