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
  const activeClassName = 'podcast__tab--active';

  // TODO: find better solution for active classes

  let isAboutActive = false;
  let isFeedActive = false;
  let isReviewsActive = false;

  let TabComponent;

  switch (url) {
    case 'feed':
      TabComponent = Feed;
      isAboutActive = false;
      isFeedActive = true;
      isReviewsActive = false;
      break;

    case 'reviews':
      TabComponent = Reviews;
      isAboutActive = false;
      isFeedActive = false;
      isReviewsActive = true;
      break;

    default:
      TabComponent = About;

      isAboutActive = true;
      isFeedActive = false;
      isReviewsActive = false;

      break;
  }

  return (
    <div className="podcast__details container">
      <div className="podcast__tabs">
        <div className="podcast__tab-wrapper">
          <Link
            href={{
              pathname,
              query: { id, url: 'about' },
            }}
          >
            <a className={`podcast__tab ${isAboutActive && activeClassName}`}>
              About
            </a>
          </Link>
        </div>
        <div className="podcast__tab-wrapper">
          <Link
            href={{
              pathname,
              query: { id, url: 'feed' },
            }}
          >
            <a className={`podcast__tab ${isFeedActive && activeClassName}`}>
              Feed
            </a>
          </Link>
        </div>
        <div className="podcast__tab-wrapper">
          <Link
            href={{
              pathname,
              query: { id, url: 'reviews' },
            }}
          >
            <a className={`podcast__tab ${isReviewsActive && activeClassName}`}>
              Reviews
            </a>
          </Link>
        </div>
      </div>
      <TabComponent id={id} />
    </div>
  );
};

export default withRouter(PodcastTabs);
