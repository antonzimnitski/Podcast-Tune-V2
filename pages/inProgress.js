/* eslint-disable import/no-cycle */
import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from '../components/Sidebar/User';

import Episode from '../components/Episode';

const GET_USER_IN_PROGRESS_QUERY = gql`
  query GET_USER_IN_PROGRESS_QUERY {
    inProgress {
      id

      episode {
        id
        title
        description
        pubDate
        isInFavorites
        isInQueue

        podcast {
          id
          artworkSmall
        }
      }
    }
  }
`;

const InProgress = ({ me, inProgress }) => {
  if (!me) return <div>Redirect later to login page.</div>;

  let returnContent;

  if (Array.isArray(inProgress) && inProgress.length > 0) {
    returnContent = inProgress.map(({ episode }) => (
      <Episode key={episode.id} episode={episode} />
    ));
  } else {
    returnContent = <div>No In Progress episodes available.</div>;
  }

  return <div className="in-progress container">{returnContent}</div>;
};

export { GET_USER_IN_PROGRESS_QUERY };

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(GET_USER_IN_PROGRESS_QUERY, {
    props: ({ data: { loading, error, inProgress } }) => ({
      loading,
      error,
      inProgress,
    }),
    skip: props => !props.me,
  })
)(InProgress);
