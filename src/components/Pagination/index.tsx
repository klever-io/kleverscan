import { ArrowLeft, ArrowRight } from '@/assets/pagination';
import React, { useEffect, useState } from 'react';
import calculate from './paginate';
import PaginationModal from './PaginationModal/PaginationModal';
import { ArrowContainer, Container, ItemContainer } from './styles';

interface IPagination {
  scrollUp: boolean;
  count: number;
  page: number;
  onPaginate(page: number): void;
}

const Pagination: React.FC<IPagination> = ({
  count,
  page,
  onPaginate,
  scrollUp,
}) => {
  // count += 1;
  count >= 1000 ? (count = 1000) : count;
  const cells = calculate(count, page);

  const [showModalLeft, setShowModalLeft] = useState(false);
  const [showModalRight, setShowModalRight] = useState(false);

  useEffect(() => {
    if (scrollUp) {
      window.scrollTo(0, 0);
    }
  }, [page]);

  const prevProps = {
    active: page > 1,
    onClick: () => {
      if (page > 1) {
        onPaginate(page - 1);
      }
    },
  };

  const nextProps = {
    active: page < count,
    onClick: () => {
      if (page + 1 <= count) {
        onPaginate(page + 1);
      }
    },
  };

  const modalLeftController = () => {
    setShowModalLeft(!showModalLeft);
    if (showModalRight) {
      setShowModalRight(false);
    }
  };

  const modalRightController = () => {
    setShowModalRight(!showModalRight);
    if (showModalLeft) {
      setShowModalLeft(false);
    }
  };

  return (
    <Container>
      <ArrowContainer {...prevProps}>
        <ArrowLeft />
      </ArrowContainer>

      {cells.map(({ value, leftEllipsis, rightEllipsis }) => {
        const paginationProps = {
          totalPages: count,
          page,
          onPaginate,
        };

        const leftPaginationProps = {
          ...paginationProps,
          modalLeft: true,
          showModal: showModalLeft,
          setShowModal: setShowModalLeft,
        };

        const rightPaginationProps = {
          ...paginationProps,
          modalLeft: false,
          showModal: showModalRight,
          setShowModal: setShowModalRight,
        };

        if (leftEllipsis) {
          return (
            <div key={value}>
              <ItemContainer
                active={value === page + 1}
                onClick={() => modalLeftController()}
                onMouseDown={e => e.preventDefault()}
              >
                {'...'}
              </ItemContainer>
              <PaginationModal {...leftPaginationProps} />
            </div>
          );
        }

        if (rightEllipsis) {
          return (
            <div key={value}>
              <ItemContainer
                active={value === page + 1}
                onClick={() => modalRightController()}
                onMouseDown={e => e.preventDefault()}
              >
                {'...'}
              </ItemContainer>
              <PaginationModal {...rightPaginationProps} />
            </div>
          );
        }

        return (
          <ItemContainer
            key={value}
            active={value === page}
            onClick={() => onPaginate(value)}
          >
            <span>{value}</span>
          </ItemContainer>
        );
      })}
      <ArrowContainer {...nextProps}>
        <ArrowRight />
      </ArrowContainer>
    </Container>
  );
};

export default Pagination;
