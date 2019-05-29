import React from 'react';
import { string } from 'prop-types';

const SearchPage = ({ term }) => <div className="search">SearchPage</div>;

export default SearchPage;

SearchPage.propTypes = {
  term: string,
};

SearchPage.defaultProps = {
  term: '',
};
