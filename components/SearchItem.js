import React from 'react';
import Link from 'next/link';

import { searchItemType } from '../types';

const SearchItem = ({ searchItem }) => {
  const { id, title, author, artworkSmall } = searchItem;

  return (
    <Link
      href={{
        pathname: '/podcast',
        query: { id },
      }}
    >
      <a className="search__item">
        <img src={artworkSmall} alt={title} className="search__item-image" />
        <div className="search__item-info">
          <h3 className="search__item-title">{title}</h3>
          <p className="search__item-author">{author}</p>
        </div>
      </a>
    </Link>
  );
};

export default SearchItem;

SearchItem.propTypes = {
  searchItem: searchItemType.isRequired,
};
