import React from 'react';
import { Mutation, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { bool, string } from 'prop-types';

import Icon from '@mdi/react';
import { mdiPlay as playIcon, mdiPause as pauseIcon } from '@mdi/js';

import { episodeType } from '../types';

import Options from './options';

import { CURRENT_USER_QUERY } from './Sidebar/User';
import { GET_USER_PLAYING_EPISODE } from './Audioplayer';
import { GET_USER_QUEUE } from './Audioplayer/controls/queue';

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

const Episode = ({ episode, isPlaying, playingEpisode }) => {
  const { id, title, description, pubDate, podcast } = episode;
  const { artworkSmall } = podcast;

  let mutation;
  let icon;

  if (playingEpisode && playingEpisode.episode.id !== id) {
    mutation = SET_USER_PLAYING_EPISODE_MUTATION;
    icon = playIcon;
  } else {
    mutation = isPlaying ? PAUSE_MUTATION : PLAY_MUTATION;

    icon = isPlaying ? pauseIcon : playIcon;
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
          mutation={mutation}
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
              <Icon path={icon} className="episode__play-icon" />
            </button>
          )}
        </Mutation>

        <Options episodeId={id} />
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
  })
)(Episode);

Episode.propTypes = {
  episode: episodeType.isRequired,
  isPlaying: bool.isRequired,
  playingEpisodeId: string,
};

Episode.defaultProps = {
  playingEpisodeId: null,
};
