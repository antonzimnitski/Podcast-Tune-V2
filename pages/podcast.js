import PodcastPage from '../components/PodcastPage';
import { urlQueryType } from '../types';

const Podcast = ({ query }) => (
  <div>
    <PodcastPage id={query.id} />
  </div>
);

export default Podcast;

Podcast.propTypes = {
  query: urlQueryType,
};
