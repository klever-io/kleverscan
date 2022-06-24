import styled, { keyframes } from 'styled-components';

interface DayItemProps {
  isKey: boolean;
  isBetween: boolean;
  isCurrent: boolean;
  isAfter: boolean;
}

interface ConfirmButtonProps {
  isActive: boolean;
}

interface MonthPickerProps {
  isDisabledRight: boolean;
}

export const fadeInItem = keyframes`
  from {
    opacity: 0.1;
    transform: translateY(4px);

  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
export const fadeInContainer = keyframes`
  from {
    opacity: 0.1;
    transform: translateY(calc(100% + 5px));

  }
  to {
    opacity: 1;
    transform: translateY(100%);
  }
`;

export const fadeInContainerMobile = keyframes`
  from {
    opacity: 0.1;
    transform: translateY(calc(90% + 5px)) translateX(-50%);


  }
  to {
    opacity: 1;
    transform: translateY(90%) translateX(-50%);

  }
`;

export const Container = styled.div`
  display: block;
  position: relative;
`;

export const OutsideContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
  height: 2.8rem;
  svg {
    height: 2rem;
    width: 2rem;
    color: ${props => props.theme.navbar.text};
    animation: ${fadeInItem} 0.2s ease-in-out;
    &:hover {
      cursor: pointer;
      filter: brightness(0.5);
    }
  }
`;

export const OutsideContent = styled.div`
  padding: 1rem 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(198, 199, 235, 0.2);
  border-radius: 0.5rem;

  cursor: pointer;

  transition: 0.2s ease;

  svg {
    height: unset !important;
    width: unset !important;
  }
  &:hover {
    filter: brightness(0.9);
  }
`;

export const Input = styled.input`
  width: 75%;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${props => props.theme.footer.hover};

  caret-color: transparent;

  cursor: pointer;
  &::placeholder {
    color: ${props => props.theme.footer.hover};
  }
  &:not([value='']) {
    animation: ${fadeInItem} 0.2s ease-in-out;
    width: 100%;
    text-align: center;
  }
`;

export const CalendarContainer = styled.div`
  min-height: 18rem;
  width: 18rem;
  padding: 1rem;
  margin-left: 5rem;
  background-color: ${props => props.theme.white};
  position: absolute;
  bottom: -0.5rem;
  left: -3rem;
  transform: translateY(100%);
  z-index: 10;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    animation: ${fadeInContainer} 0.2s linear;
  }

  @media (max-width: 768px) {
    animation: ${fadeInContainerMobile} 0.2s linear forwards;
  }
`;
export const CalendarHeader = styled.div`
  color: ${props => props.theme.black};
  strong {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      cursor: pointer;
    }
  }
  p {
    font-weight: 400;
    font-size: 0.9rem;
    margin: 1rem 0;
  }
`;

export const CalendarContent = styled.div`
  display: flex;
  flex-direction: column;
  user-select: none;
`;

export const MonthPicker = styled.div.attrs((props: MonthPickerProps) => ({
  isDisabledRight: props.isDisabledRight,
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.black};
  font-size: 0.95rem;
  svg {
    cursor: pointer;
    &:hover {
      filter: brightness(1.5);
    }
    ${props =>
      props.isDisabledRight &&
      `
    &:last-of-type {
      pointer-events: none;
      filter: opacity(0.4);
    }
  `}
  }
`;

export const DayPicker = styled.div`
  margin-top: 0.5rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.navbar.text};
  font-size: 0.9rem;
`;

export const HeaderItem = styled.div`
  font-weight: 400;
  color: ${props => props.theme.navbar.text};
`;

export const DaysTable = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export const DayItem = styled.div.attrs((props: DayItemProps) => ({
  isKey: props.isKey,
  isBetween: props.isBetween,
  isCurrent: props.isCurrent,
  isAfter: props.isAfter,
}))`
  margin: 0.5rem auto 0;
  height: 2rem;
  width: 2rem;
  text-align: center;
  line-height: 2rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.1s ease-in-out;
  animation: ${fadeInItem} 0.5s ease-in-out;

  cursor: pointer;
  color: ${props => props.theme.black};
  ${props =>
    props.isKey &&
    `
    background-color: ${props.theme.purple};
    color: ${props.theme.white};
  `};
  ${props =>
    props.isBetween &&
    !props.isKey &&
    `
    background-color: ${props.theme.purple};
    filter: opacity(0.75);
    color: ${props.theme.white};
  `};

  ${props =>
    props.isCurrent &&
    !props.isKey &&
    !props.isBetween &&
    `background-color: ${props.theme.gray}`};
  ${props =>
    props.isAfter &&
    `
    color: ${props.theme.gray};
    pointer-events: none;
    `}
`;

export const Warning = styled.div`
  display: flex;
  background-color: #ffe38088;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
  span {
    font-size: 0.9rem;
    color: ${props => props.theme.table.pending};
  }
`;

export const Confirm = styled.button.attrs((props: ConfirmButtonProps) => ({
  isActive: props.isActive,
}))`
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.purple};
  transition: all 0.1s ease-in-out;
  ${props =>
    !props.isActive &&
    `
    filter: opacity(0.5);
    pointer-events: none;
  `}
`;
