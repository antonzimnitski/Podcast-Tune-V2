import React from 'react';
import { Mutation, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { bool, string } from 'prop-types';

import Icon from '@mdi/react';
import { mdiPlay as playIcon, mdiPause as pauseIcon } from '@mdi/js';

import { episodeType } from '../types';

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

const SET_PLAYING_EPISODE_MUTATION = gql`
  mutation($id: ID!) {
    setPlayingEpisode(id: $id) @client
  }
`;

const PLAYING_EPISODE_ID_QUERY = gql`
  query {
    playingEpisodeId @client
  }
`;

const PLAYING_STATUS_QUERY = gql`
  query {
    isPlaying @client
  }
`;

const Episode = ({ episode, isPlaying, playingEpisodeId }) => {
  const { id, title, description, pubDate, podcast } = episode;
  const { artworkSmall } = podcast;

  let mutation;
  let icon;

  if (playingEpisodeId !== id) {
    mutation = SET_PLAYING_EPISODE_MUTATION;
    icon = playIcon;
  } else {
    mutation = isPlaying ? PAUSE_MUTATION : PLAY_MUTATION;

    icon = isPlaying ? pauseIcon : playIcon;
  }

  return (
    <div key={id} className="episode">
      <div className="episode__top-row">
        <div className="episode__info">
          <img src={artworkSmall} alt="" className="episode__artwork" />
          <div className="episode__title-wrapper">
            <p className="episode__title">{title}</p>
            <p className="episode__pubDate">{pubDate}</p>
          </div>
        </div>
        <div className="episode__controls">
          <Mutation
            mutation={mutation}
            variables={{
              id,
            }}
          >
            {method => (
              <button
                type="button"
                className="btn btn--control"
                onClick={() => method()}
              >
                <Icon path={icon} className="episode__controls-play" />
              </button>
            )}
          </Mutation>
        </div>
      </div>
      {description && (
        <div className="episode__bottom-row">
          <p className="episode__description">{description}</p>
        </div>
      )}
    </div>
  );
};

export default compose(
  graphql(PLAYING_EPISODE_ID_QUERY, {
    props: ({ data: { playingEpisodeId } }) => ({ playingEpisodeId }),
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
