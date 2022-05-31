import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import { Container, ListUris } from './styles';

interface IUris {
  [index: string]: {
    [index: string]: string;
  };
}

const Dropdown: React.FC<IUris> = ({ uris }) => {
  const [showMore, setShowMore] = useState(false);
  const keys = uris ? Object.keys(uris) : [];

  const getUriKeys = () => {
    if (showMore) return keys;
    return keys.slice(0, 3);
  };

  const renderArrowShowMore = () => {
    if (showMore) return <IoIosArrowUp />;
    return <IoIosArrowDown />;
  };

  const renderCorrectPath = (uriKey: string) => {
    if (uriKey.startsWith('https://')) {
      return uriKey;
    }
    return `https://${uriKey}`;
  };

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
