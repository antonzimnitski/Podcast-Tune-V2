import React from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Icon from '@mdi/react';
import { mdiStar as favouriteIcon, mdiPlay as playIcon } from '@mdi/js';

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

const queueEpisode = ({ episode, setPlayingEpisode }) => {
  const { id, title, podcast } = episode;

  console.log(episode);

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
          onClick={() =>
            setPlayingEpisode({
              variables: { id },
              refetchQueries: [
                { query: GET_USER_PLAYING_EPISODE },
                { query: GET_USER_QUEUE },
              ],
            })
          }
        >
          <Icon className="queue-episode__play-icon" path={playIcon} />
        </button>
      </div>
      <div className="queue-episode__details">
        <div className="queue-episode__title">{title}</div>
        <div className="queue-episode__podcast-name">{podcast.title}</div>
      </div>
      <div className="queue-episode__actions">
        <button type="button" className="queue-episode__favourite">
          <Icon className="queue-episode__icon" path={favouriteIcon} />
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
  })
)(queueEpisode);
