/* eslint-disable import/no-cycle */
import React from 'react';
import { graphql, compose } from 'react-apollo';
import Link from 'next/link';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from '../components/Sidebar/User';

import Episode from '../components/Episode';

const GET_USER_SUBSCRIBED_PODCASTS_QUERY = gql`
  query GET_USER_SUBSCRIBED_PODCASTS_QUERY {
    subscribedPodcasts {
      id
      subscribedAt

      podcast {
        id
        title
        artworkLarge
      }
    }
  }
`;

const Podcasts = ({ me, subscribedPodcasts }) => {
  if (!me) return <div>Redirect later to login page.</div>;

  let returnContent;

  if (Array.isArray(subscribedPodcasts) && subscribedPodcasts.length > 0) {
    returnContent = subscribedPodcasts.map(({ podcast }) => {
      const { id, title, artworkLarge } = podcast;
      return (
        <div className="podcasts__card">
          <Link
            href={{
              pathname: '/podcast',
              query: { id },
            }}
          >
            <a className="podcasts__link">
              <img
                src={artworkLarge}
                alt={`${title} podcast artwork.`}
                className="podcasts__image"
                title={title}
              />
            </a>
          </Link>
        </div>
      );
    });
  } else {
    returnContent = <div>No favorites episodes available.</div>;
  }

  return (
    <div className="podcasts">
      <h1 className="page__title">Podcasts</h1>
      <div className="podcast__content">{returnContent}</div>
    </div>
  );
};

export { GET_USER_SUBSCRIBED_PODCASTS_QUERY };

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(GET_USER_SUBSCRIBED_PODCASTS_QUERY, {
    props: ({ data: { loading, error, subscribedPodcasts } }) => ({
      loading,
      error,
      subscribedPodcasts,
    }),
    skip: props => !props.me,
  })
)(Podcasts);
