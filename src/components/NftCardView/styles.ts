import styled from 'styled-components';

export const NftCardContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.violet};
  }
`;

export const NftCardImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.gray};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const NftCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NftCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.black};
  margin: 0;
`;

export const NftCardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.gray800};

  div {
    display: flex;
    justify-content: space-between;

    strong {
      color: ${({ theme }) => theme.black};
    }
  }
`;

export const NftCardAddress = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.black};

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const NftCardLink = styled.div`
  margin-top: 8px;

  a {
    width: 100%;
    display: inline-block;
    text-align: center;
    padding: 10px 16px;
    background: ${({ theme }) => theme.violet};
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s ease;

    &:hover {
      filter: brightness(1.2);
    }
  }
`;
