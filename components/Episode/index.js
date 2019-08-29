/* eslint-disable import/no-cycle */
import React from 'react';
import { Mutation, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { bool } from 'prop-types';

import Icon from '@mdi/react';
import {
  mdiPlay as playIcon,
  mdiPause as pauseIcon,
  mdiStar as inFavoritesIcon,
  mdiStarOutline as notInFavoritesIcon,
} from '@mdi/js';

import { episodeType } from '../../types';

import Options from './options';

import { CURRENT_USER_QUERY } from '../Sidebar/User';
import { GET_USER_PLAYING_EPISODE } from '../Audioplayer';
import { GET_USER_QUEUE } from '../Audioplayer/controls/queue';
import { GET_USER_FAVORITES_QUERY } from '../../pages/favorites';

const PLAY_MUTATION = gql`
  mutation {
    play @client
  }
`;

const PAUSE_MUTATION = gql`
  mutation {
    pause @client
  }
`;

// const SET_PLAYING_EPISODE_MUTATION = gql`
//   mutation($id: ID!) {
//     setPlayingEpisode(id: $id) @client
//   }
// `;

// const PLAYING_EPISODE_ID_QUERY = gql`
//   query {
//     playingEpisodeId @client
//   }
// `;

const ADD_EPISODE_TO_USER_FAVORITES_MUTATION = gql`
  mutation($id: ID!) {
    addEpisodeToFavorites(id: $id) {
      id
      addedAt

      episode {
        id
        title
        description
        pubDate
        isInFavorites
        isInQueue

        podcast {
          id
          title
          artworkSmall
        }
      }
    }
  }
`;

const REMOVE_EPISODE_FROM_USER_FAVORITES_MUTATION = gql`
  mutation($id: ID!) {
    removeEpisodeFromFavorites(id: $id) {
      id
      addedAt

      episode {
        id
        title
        description
        pubDate
        isInFavorites
        isInQueue

        podcast {
          id
          title
          artworkSmall
        }
      }
    }
  }
`;

const SET_USER_PLAYING_EPISODE_MUTATION = gql`
  mutation($id: ID!) {
    setPlayingEpisode(id: $id) {
      id
      position
    }
  }
`;

const GET_USER_PLAYING_EPISODE_ID = gql`
  query GET_USER_PLAYING_EPISODE_ID {
    playingEpisode {
      id

      episode {
        id
      }
    }
  }
`;

const PLAYING_STATUS_QUERY = gql`
  query {
    isPlaying @client
  }
`;

const Episode = ({
  episode,
  isPlaying,
  playingEpisode,
  addToFavorites,
  removeFromFavorites,
}) => {
  const {
    id,
    title,
    description,
    pubDate,
    podcast,
    isInFavorites,
    isInQueue,
  } = episode;
  const { artworkSmall } = podcast;

  let playMutation;
  let playBtnIcon;

  if (playingEpisode && playingEpisode.episode.id !== id) {
    playMutation = SET_USER_PLAYING_EPISODE_MUTATION;
    playBtnIcon = playIcon;
  } else {
    playMutation = isPlaying ? PAUSE_MUTATION : PLAY_MUTATION;

    playBtnIcon = isPlaying ? pauseIcon : playIcon;
  }

  return (
    <div key={id} className="episode">
      <div className="episode__top-row">
        <img src={artworkSmall} alt="" className="episode__artwork" />
        <div className="episode__info">
          <div className="episode__title-wrapper">
            <p className="episode__title">{title}</p>
            <p className="episode__pubDate">{pubDate}</p>
          </div>
          <p className="episode__description">{description}</p>
        </div>
      </div>
      <div className="episode__controls">
        <Mutation
          mutation={playMutation}
          variables={{
            id,
          }}
          refetchQueries={[
            { query: GET_USER_PLAYING_EPISODE },
            { query: GET_USER_QUEUE },
          ]}
        >
          {method => (
            <button
              type="button"
              className="episode__play-btn"
              onClick={() => method()}
            >
              <Icon path={playBtnIcon} className="episode__play-icon" />
            </button>
          )}
        </Mutation>

        <Options episodeId={id} isInQueue={isInQueue} />

        <button
          type="button"
          className="episode__play-btn"
          onClick={isInFavorites ? removeFromFavorites : addToFavorites}
        >
          <Icon
            path={isInFavorites ? inFavoritesIcon : notInFavoritesIcon}
            className="episode__play-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  // graphql(PLAYING_EPISODE_ID_QUERY, {
  //   props: ({ data: { playingEpisodeId } }) => ({ playingEpisodeId }),
  // }),
  graphql(GET_USER_PLAYING_EPISODE_ID, {
    props: ({ data: { playingEpisode } }) => ({ playingEpisode }),
    skip: props => !props.me,
  }),
  graphql(PLAYING_STATUS_QUERY, {
    props: ({ data: { isPlaying } }) => ({ isPlaying }),
  }),
  graphql(ADD_EPISODE_TO_USER_FAVORITES_MUTATION, {
    name: 'addToFavorites',
    skip: props => !props.me,
    options: ({ episode: { id } }) => ({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_USER_FAVORITES_QUERY }],
    }),
  }),
  graphql(REMOVE_EPISODE_FROM_USER_FAVORITES_MUTATION, {
    name: 'removeFromFavorites',
    skip: props => !props.me,
    options: ({ episode: { id } }) => ({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_USER_FAVORITES_QUERY }],
    }),
  })
)(Episode);

Episode.propTypes = {
  episode: episodeType.isRequired,
  isPlaying: bool.isRequired,
};
