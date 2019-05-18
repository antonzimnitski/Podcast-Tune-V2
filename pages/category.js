import CategoryPage from '../components/CategoryPage';
import { urlQueryType } from '../types';

const Category = ({ query }) => (
  <div>
    <CategoryPage id={query.id} />
  </div>
);

export default Category;

Category.propTypes = {
  query: urlQueryType,
};
