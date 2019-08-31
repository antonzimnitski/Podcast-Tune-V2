/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { func } from 'prop-types';

import Icon from '@mdi/react';
import {
  mdiHeart as inFavoritesIcon,
  mdiHeartOutline as notInFavoritesIcon,
  mdiClock as clockIcon,
  mdiDotsHorizontal as moreIcon,
} from '@mdi/js';

import { episodeType } from '../../types';

import PlayButton from './playButton';
import Options from './options';

import { CURRENT_USER_QUERY } from '../Sidebar/User';
import { GET_USER_FAVORITES_QUERY } from '../../pages/favorites';

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

const Episode = ({ episode, addToFavorites, removeFromFavorites }) => {
  const {
    id,
    title,
    description,
    pubDate,
    podcast,
    isInFavorites,
    isInQueue,
    episodeArtwork,
  } = episode;
  const { artworkSmall } = podcast;

  const [isOptionsOpen, setOptionsStatus] = useState(false);

  return (
    <div key={id} className="episode">
      <div className="episode__top-row">
        <div className="episode__artwork-wrapper">
          <img
            src={episodeArtwork || artworkSmall}
            alt=""
            className="episode__artwork"
          />
        </div>
        <div className="episode__info">
          <div className="episode__title-wrapper">
            <p className="episode__title">{title}</p>
          </div>
          <div className="episode__stats">
            <div className="episode__rating">rating</div>

            <div className="episode__pubDate-wrapper">
              <Icon className="episode__pubDate-icon" path={clockIcon} />
              <span className="episode__pubDate">{pubDate}</span>
            </div>
          </div>
          <p className="episode__description">{description}</p>
        </div>
      </div>
      <div className="episode__controls">
        <button
          type="button"
          className="episode__favorite-btn"
          onClick={isInFavorites ? removeFromFavorites : addToFavorites}
          title={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Icon
            path={isInFavorites ? inFavoritesIcon : notInFavoritesIcon}
            className="episode__favorite-icon"
          />
        </button>

        <div className="options">
          <button
            type="button"
            className={`options__button ${
              isOptionsOpen ? 'options__button--open' : ''
            }`}
            onClick={() => setOptionsStatus(!isOptionsOpen)}
          >
            <Icon className="options__icon" path={moreIcon} />
            <span className="options__label" title="More">
              More
            </span>
          </button>

          {isOptionsOpen && (
            <Options
              isInQueue={isInQueue}
              episodeId={id}
              onClose={() => setOptionsStatus(false)}
            />
          )}
        </div>

        <PlayButton episodeId={id} />
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
  addToFavorites: func.isRequired,
  removeFromFavorites: func.isRequired,
};
