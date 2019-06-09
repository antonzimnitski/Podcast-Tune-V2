import { string } from 'prop-types';
import SearchItem from './SearchItem';

import { resultsType } from '../../types';

const SearchResults = ({ title, results }) => {
  if (!results || !results.length) return null;

  return (
    <div className="search__results">
      <h2 className="search__sub-title">{title}</h2>
      <div className="search__result-list">
        {results.map(podcast => (
          <SearchItem key={podcast.id} searchItem={podcast} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

SearchResults.propTypes = {
  title: string.isRequired,
  results: resultsType.isRequired,
};
