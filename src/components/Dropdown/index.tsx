import React, { useCallback, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Container, ListUris } from './styles';

interface IUris {
  [index: string]: {
    [index: string]: string;
  };
}

const Dropdown: React.FC<IUris> = ({ uris }) => {
  const [showMore, setShowMore] = useState(false);
  const keys = uris ? Object.keys(uris) : [];

  const getUriKeys = useCallback(() => {
    if (showMore) return keys;
    return keys.slice(0, 3);
  }, [showMore, keys]);

  const renderArrowShowMore = useCallback(() => {
    if (showMore) return <IoIosArrowUp />;
    return <IoIosArrowDown />;
  }, [showMore]);

  const renderCorrectPath = useCallback((uriKey: string) => {
    if (uriKey.startsWith('https://')) {
      return uriKey;
    }
    return `https://${uriKey}`;
  }, []);

  return (
    <Container>
      <ListUris>
        {getUriKeys().map(key => {
          return (
            <p key={key}>
              <strong>{key}: </strong>
              <a href={renderCorrectPath(uris[key])}>{uris[key]}</a>
            </p>
          );
        })}
      </ListUris>
      <button onClick={() => setShowMore(!showMore)}>
        {keys.length > 4 ? renderArrowShowMore() : ''}
      </button>
    </Container>
  );
};

export default Dropdown;
