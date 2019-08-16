/* eslint-disable import/no-cycle */
import React from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Icon from '@mdi/react';
import {
  mdiStar as favouriteIcon,
  mdiPlay as playIcon,
  mdiClose as deleteIcon,
} from '@mdi/js';

import { CURRENT_USER_QUERY } from '../../Sidebar/User';
import { GET_USER_PLAYING_EPISODE } from '../index';
import { GET_USER_QUEUE } from './queue';

const SET_USER_PLAYING_EPISODE_MUTATION = gql`
  mutation($id: ID!) {
    setPlayingEpisode(id: $id) {
      id
      position
    }
  }
`;

const REMOVE_EPISODE_FROM_USER_QUEUE_MUTATION = gql`
  mutation($id: ID!) {
    removeEpisodeFromQueue(id: $id) {
      id
    }
  }
`;

const queueEpisode = ({ episode, setPlayingEpisode, removeFromQueue }) => {
  const { title, podcast } = episode;

  return (
    <div className="queue-episode">
      <div className="queue-episode__artwork-wrapper">
        <div
          className="queue-episode__artwork"
          style={{
            backgroundImage: `url("${podcast.artworkSmall}")`,
          }}
        />

        <button
          type="button"
          className="queue-episode__play-btn"
          onClick={setPlayingEpisode}
        >
          <Icon className="queue-episode__play-icon" path={playIcon} />
        </button>
      </div>
      <div className="queue-episode__details">
        <div className="queue-episode__title">{title}</div>
        <div className="queue-episode__podcast-name">{podcast.title}</div>
      </div>
      <div className="queue-episode__actions">
        <button
          type="button"
          className="queue-episode__delete"
          title="Remove from Up Next"
          onClick={removeFromQueue}
        >
          <Icon className="queue-episode__icon" path={deleteIcon} />
        </button>
      </div>
    </div>
  );
};

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(SET_USER_PLAYING_EPISODE_MUTATION, {
    name: 'setPlayingEpisode',
    skip: props => !props.me,
    options: ({ episode: { id } }) => ({
      variables: {
        id,
      },
      refetchQueries: [
        { query: GET_USER_QUEUE },
        { query: GET_USER_PLAYING_EPISODE },
      ],
    }),
  }),
  graphql(REMOVE_EPISODE_FROM_USER_QUEUE_MUTATION, {
    name: 'removeFromQueue',
    skip: props => !props.me,
    options: ({ episode: { id } }) => ({
      variables: {
        id,
      },
      refetchQueries: [
        { query: GET_USER_QUEUE },
        { query: GET_USER_PLAYING_EPISODE },
      ],
    }),
  })
)(queueEpisode);
