import { PropsWithChildren } from 'react';
import Input from '@/components/Input';
import React, { useCallback, useEffect, useState } from 'react';
import { MdClear } from 'react-icons/md';
import {
  Confirm,
  Container,
  PaginationModalContainer,
  PaginationModalHeader,
} from './styles';

interface IPaginationModal {
  totalPages: number;
  page: number;
  onPaginate: (page: number) => void;
  modalLeft: boolean;
  showModal: boolean;
  setShowModal: React.SetStateAction<any>;
}

const PaginationModal: React.FC<PropsWithChildren<IPaginationModal>> = ({
  totalPages: count,
  page,
  onPaginate,
  modalLeft,
  showModal,
  setShowModal,
}) => {
  const [buttonActive, setButtonActive] = useState(false);
  const [newPage, setNewPage] = useState<'' | number>('');
  const [mouseOut, setMouseOut] = useState(true);

  useEffect(() => {
    if (
      typeof newPage === 'number' &&
      newPage > 0 &&
      newPage != page + 1 &&
      newPage < count + 1
    ) {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }
  }, [newPage, page, count]);

  const handleConfirmClick = () => {
    onPaginate(Number(newPage));
    handleClose();
    setMouseOut(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = useCallback((value: string) => {
    const numberOrEmptyString = value.replace(/[^\d]+/g, '');
    if (numberOrEmptyString !== '') {
      setNewPage(Number(numberOrEmptyString));
    } else {
      setNewPage('');
    }
  }, []);

  const handleBlur = () => {
    if (mouseOut) {
      setShowModal(false);
    }
  };

  return (
    <Container>
      {showModal && (
        <PaginationModalContainer
          modalLeft={modalLeft}
          onMouseLeave={() => setMouseOut(true)}
          onMouseEnter={() => setMouseOut(false)}
          onBlur={() => handleBlur()}
          tabIndex="0"
        >
          <PaginationModalHeader>
            <strong>
              <span>Choose Page</span>
              <MdClear onClick={handleClose} />
            </strong>
          </PaginationModalHeader>
          <Input
            type="text"
            value={newPage}
            onChange={e => handleChange(e.target.value)}
            onBlur={() => handleBlur()}
            handleConfirmClick={handleConfirmClick}
          />
          <Confirm isActive={buttonActive} onClick={handleConfirmClick}>
            Confirm
          </Confirm>
        </PaginationModalContainer>
      )}
    </Container>
  );
};

export default PaginationModal;
