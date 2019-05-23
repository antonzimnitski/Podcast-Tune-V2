import PodcastPage from '../components/PodcastPage';
import { urlQueryType } from '../types';

const Podcast = ({ query }) => <PodcastPage id={query.id} />;

export default Podcast;

Podcast.propTypes = {
  query: urlQueryType,
};
