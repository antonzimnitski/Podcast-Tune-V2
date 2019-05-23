import PodcastPage from '../components/PodcastPage';
import { urlQueryType } from '../types';

const Podcast = ({ query }) => <PodcastPage id={query.id} url={query.url} />;

export default Podcast;

Podcast.propTypes = {
  query: urlQueryType,
};
