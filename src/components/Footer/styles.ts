import styled from 'styled-components';

export const Container = styled.footer`
  padding: 5rem 10rem;

  display: flex;

  flex-direction: row;
  gap: 5rem;

  background-color: ${props => props.theme.footer.background};
`;

export const DescriptionContainer = styled.div`
  display: flex;

  flex-direction: column;
  flex: 0 0 40%;

  span {
    padding: 1.25rem 0;

    font-size: 0.9rem;
    font-weight: 500;
    color: white;
  }
`;

export const SocialContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 0.75rem;
`;

export const SocialIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 2px solid ${props => props.theme.footer.socialBorder};
  border-radius: 50%;

  color: white;
  font-size: 0.85rem;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.footer.hover};
    background-color: ${props => props.theme.footer.hover};
  }
`;

export const LinksContainer = styled.div`
  display: flex;

  flex-direction: column;
  flex: 0 0 20%;
`;

export const LinkItems = styled.div`
  display: flex;

  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 1.75rem;
  }

  span {
    padding-bottom: 1rem;

    font-weight: 500;
    color: ${props => props.theme.white};
  }

  a {
    margin-left: 1rem;

    font-size: 0.9rem;
    font-weight: 400;
    color: ${props => props.theme.footer.text};

    text-decoration: none;

    transition: 0.2s ease;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    &:hover {
      color: ${props => props.theme.footer.hover};
    }
  }
`;
