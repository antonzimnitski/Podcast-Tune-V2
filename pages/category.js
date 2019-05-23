import CategoryPage from '../components/CategoryPage';
import { urlQueryType } from '../types';

const Category = ({ query }) => <CategoryPage id={query.id} />;

export default Category;

Category.propTypes = {
  query: urlQueryType,
};
