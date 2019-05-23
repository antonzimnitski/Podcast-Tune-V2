import React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';

import Reviews from './ReviewsTab';
import About from './AboutTab';
import Feed from './FeedTab';

const PodcastTabs = props => {
  const { router } = props;
  const { pathname, query } = router;
  const { id, url } = query;

  let TabComponent;

  switch (url) {
    case 'feed':
      TabComponent = Feed;
      break;

    case 'reviews':
      TabComponent = Reviews;
      break;

    default:
      TabComponent = About;
      break;
  }

  return (
    <div className="podcast__details">
      <div className="podcast__tabs">
        <Link
          href={{
            pathname,
            query: { id, url: 'about' },
          }}
        >
          <a className="podcast__tab">About</a>
        </Link>
        <Link
          href={{
            pathname,
            query: { id, url: 'feed' },
          }}
        >
          <a className="podcast__tab">Feed</a>
        </Link>
        <Link
          href={{
            pathname,
            query: { id, url: 'reviews' },
          }}
        >
          <a className="podcast__tab">Reviews</a>
        </Link>
      </div>
      <TabComponent />
    </div>
  );
};

export default withRouter(PodcastTabs);
