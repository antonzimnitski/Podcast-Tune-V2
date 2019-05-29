import SearchPage from '../components/SearchPage';
import { urlQueryType } from '../types';

const Search = ({ query }) => <SearchPage term={query.term} />;

export default Search;

Search.propTypes = {
  query: urlQueryType,
};
