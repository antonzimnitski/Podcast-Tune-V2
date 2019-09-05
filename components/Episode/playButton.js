import React from 'react';
import { graphql, compose } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { object, string, bool } from 'prop-types';

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

      episode {
        id
        isPlayed
      }
    }
  }
`;

const PlayButton = ({ playingEpisode, isPlaying, episodeId: id }) => {
  let mutation;
  let icon;
  let btnText;
  let btnClassName;

  if (!playingEpisode || playingEpisode.episode.id !== id) {
    mutation = SET_USER_PLAYING_EPISODE_MUTATION;
    icon = playIcon;
    btnText = 'Play Episode';
    btnClassName = 'play-control__btn';
  } else {
    mutation = isPlaying ? PAUSE_MUTATION : PLAY_MUTATION;
    icon = isPlaying ? pauseIcon : playIcon;
    btnText = isPlaying ? 'Pause' : 'Resume';
    btnClassName = `play-control__btn ${
      isPlaying ? 'play-control__btn--playing' : ''
    }`;
  }

  const [handlePlay] = useMutation(mutation, {
    variables: {
      id,
    },
    refetchQueries: [
      { query: GET_USER_PLAYING_EPISODE },
      { query: GET_USER_QUEUE },
    ],
  });

  return (
    <div className="play-control">
      <button type="button" className={btnClassName} onClick={handlePlay}>
        <Icon path={icon} className="play-control__icon" />
        <span className="play-control__text">{btnText}</span>
      </button>
    </div>
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

PlayButton.propTypes = {
  playingEpisode: object,
  isPlaying: bool.isRequired,
  episodeId: string.isRequired,
};

PlayButton.defaultProps = {
  playingEpisode: null,
};
