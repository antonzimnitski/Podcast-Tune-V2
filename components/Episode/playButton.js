import React from 'react';
import { Mutation, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Icon from '@mdi/react';
import { mdiPlay as playIcon, mdiPause as pauseIcon } from '@mdi/js';

import { CURRENT_USER_QUERY } from '../Sidebar/User';
import { GET_USER_PLAYING_EPISODE } from '../Audioplayer';
import { GET_USER_QUEUE } from '../Audioplayer/controls/queue';

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

const SET_USER_PLAYING_EPISODE_MUTATION = gql`
  mutation($id: ID!) {
    setPlayingEpisode(id: $id) {
      id
      position
    }
  }
`;

const PlayButton = ({ playingEpisode, isPlaying, episodeId: id }) => {
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
  );
};

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(GET_USER_PLAYING_EPISODE_ID, {
    props: ({ data: { playingEpisode } }) => ({ playingEpisode }),
    skip: props => !props.me,
  }),
  graphql(PLAYING_STATUS_QUERY, {
    props: ({ data: { isPlaying } }) => ({ isPlaying }),
  })
)(PlayButton);
