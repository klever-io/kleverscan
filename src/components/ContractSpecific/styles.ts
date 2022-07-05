import styled, { css } from 'styled-components';

interface IInput {
  isCheckbox: boolean;
}

export const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-top: 10px;
  width: clamp(65%, 90%, 1000px);
`;

export const SubFormContainer = styled.div`
  padding: 20px;
`;

export const SelectContainer = styled.div`
  width: clamp(65%, 90%, 1000px);
`;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`;

export const CompoundContainer = styled.div`
  background-color: #F0F0F0;
  padding: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
`;

export const InputContainer = styled.div<IInput>`
  display: flex;
  flex-direction: ${props => props.isCheckbox ? 'row-reverse' : 'column'};
  justify-content: flex-end;
  label {
    margin-bottom: ${props => props.isCheckbox ? 0.8 : 0.5}rem;
    margin-left: ${props => props.isCheckbox ? 0.2 : 0}rem;
    margin-top: .8rem;
  }

  input {
    border: 1px solid gray;
    border-radius: 5px;
    padding: 10px;
  }
`;

export const MapContainer = styled.div`
  background-color: #F0F0F0;
  padding: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
`;

export const InputMapContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const InputMap = styled.input`
  background-color: #F8F8F8;
  padding: 10px;
  width: 45%;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 10px;
`;

export const ContainerButtons = styled.div`
  display: flex;
  flex-direction: row;

  div:nth-child(2) {
    margin-left: 1.2rem;
  }
`;

export const AddButton = styled.div`
  background-color: #2c3041;
  color: white;
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 7px;
  margin-top: 1rem;
  font-size: .8rem;
  cursor: pointer;
`;

export const SubmitButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  div {
    background-color: #0B0B1E;
    padding: 10px;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    min-width: 20%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

export const RepeatedContainer = styled.div`
  background-color: #E8E8E8;
  padding: 20px;
  margin-top: 1rem;
  border-radius: 10px;
`;

export const DivisorLine = styled.div`
  height: 0.07rem;
  width: 80%;
  background-color: black;
  opacity: 0.2;
`;

export const DivisorContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoadingContainer = styled.div`
  padding: 3rem;
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
`;