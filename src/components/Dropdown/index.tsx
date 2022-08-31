import { IUris } from '@/types/index';
import React, { useCallback, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Container, ListUris } from './styles';

const Dropdown: React.FC<IUris> = ({ uris }) => {
  const [showMore, setShowMore] = useState(false);

  const renderArrowShowMore = useCallback(() => {
    if (showMore) return <IoIosArrowUp />;
    return <IoIosArrowDown />;
  }, [showMore]);

  const renderCorrectPath = useCallback((uriKey: string) => {
    if (uriKey && uriKey.startsWith('https://')) {
      return uriKey;
    }
    return `https://${uriKey}`;
  }, []);

  return (
    <>
      {uris && (
        <Container>
          <ListUris>
            {uris.map(uri => {
              return (
                <p key={uri.key}>
                  <strong>{uri.key}: </strong>
                  <a href={renderCorrectPath(uri.value)}>{uri.value}</a>
                </p>
              );
            })}
          </ListUris>
          <button onClick={() => setShowMore(!showMore)}>
            {uris.length > 4 ? renderArrowShowMore() : ''}
          </button>
        </Container>
      )}
    </>
  );
};

export default Dropdown;
