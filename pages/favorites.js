import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from '../components/Sidebar/User';

import Episode from '../components/Episode';

const GET_USER_FAVORITES_QUERY = gql`
  query GET_USER_FAVORITES_QUERY {
    favorites {
      id

      episode {
        id
        title
        description
        pubDate

        podcast {
          id
          artworkSmall
        }
      }
    }
  }
`;

const Favorites = ({ me, favorites }) => {
  if (!me) return <div>Redirect later to login page.</div>;

  let returnContent;

  if (Array.isArray(favorites) && favorites.length > 0) {
    returnContent = favorites.map(({ episode }) => (
      <Episode key={episode.id} episode={episode} />
    ));
  } else {
    returnContent = <div>No favorites episodes available.</div>;
  }

  return <div className="favorites">{returnContent}</div>;
};

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(GET_USER_FAVORITES_QUERY, {
    props: ({ data: { loading, error, favorites } }) => ({
      loading,
      error,
      favorites,
    }),
    skip: props => !props.me,
  })
)(Favorites);
