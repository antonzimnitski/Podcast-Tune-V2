import React, { Component } from 'react';
import { graphql, Query, Mutation, compose } from 'react-apollo';
import Link from 'next/link';
import gql from 'graphql-tag';

import Icon from '@mdi/react';
import {
  mdiRotateLeft as skipBackIcon,
  mdiRotateRight as skipAheadIcon,
  mdiPlay as playIcon,
  mdiPause as pauseIcon,
} from '@mdi/js';

import { CURRENT_USER_QUERY } from '../Sidebar/User';

const GET_EPISODE_QUERY = gql`
  query GET_EPISODE_QUERY($id: ID!) {
    episode(where: { id: $id }) {
      id
      title
      pubDate
      duration
      mediaUrl

      podcast {
        id
        artworkSmall
        author
      }
    }
  }
`;

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

const OPEN_PLAYER_MUTATION = gql`
  mutation {
    openPlayer @client
  }
`;

const UPDATE_TIME_MUTATION = gql`
  mutation($current: Float!, $max: Float!) {
    updateTime(current: $current, max: $max) @client
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

const PLAYER_STATUS_QUERY = gql`
  query {
    isPlayerOpen @client
  }
`;

class Audioplayer extends Component {
  constructor(props) {
    super(props);
    this.player = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { isPlaying, playingEpisodeId, openPlayer } = this.props;

    if (!prevProps.playingEpisodeId && playingEpisodeId) {
      openPlayer();
    }

    if (isPlaying && this.player.current) {
      this.handlePlay();
    } else if (!isPlaying && this.player.current && this.player.current.src) {
      this.handlePause();
    }
  }

  handlePlay = () => {
    if (this.player.current.paused) {
      clearInterval(this.playInterval);
      const playPromise = this.player.current.play();
      playPromise.then(() => {
        this.createTimeInterval();
      });
    }
  };

  handlePause = () => {
    if (!this.player.current.paused) {
      this.player.current.pause();
      clearInterval(this.playInterval);
    }
  };

  onCanPlay = () => {
    const { isPlaying } = this.props;

    if (isPlaying) {
      this.handlePlay();
    }
  };

  verifyDuration = () => {
    console.log(this.player.current.duration);
  };

  setTime = value => {
    clearInterval(this.playInterval);
    this.player.current.currentTime = value;
    this.createTimeInterval();
  };

  skipTime = amount => {
    if (this.player.current) {
      const newTime = this.player.current.currentTime + amount;
      this.setTime(newTime);
    }
  };

  onEnded = () => {
    console.log('On ended');
  };

  createTimeInterval() {
    const { updateTime } = this.props;

    this.playInterval = setInterval(() => {
      if (this.player.current) {
        updateTime({
          variables: {
            current: this.player.current.currentTime,
            max: this.player.current.duration,
          },
        });
      }
    }, 1000);
  }

  render() {
    const { playingEpisodeId, isPlaying, isPlayerOpen } = this.props;

    if (!isPlayerOpen) return null;

    const mutation = isPlaying ? PAUSE_MUTATION : PLAY_MUTATION;
    const icon = isPlaying ? pauseIcon : playIcon;

    return (
      <Query
        query={GET_EPISODE_QUERY}
        variables={{ id: playingEpisodeId }}
        skip={!playingEpisodeId}
        ssr={false}
      >
        {({ data, error, loading }) => {
          if (error) return null;

          const { episode } = data;

          return (
            <div className="player">
              {!!episode && (
                <Link
                  href={{
                    pathname: '/podcast',
                    query: { id: episode.podcast.id },
                  }}
                >
                  <a className="player__artwork-wrapper">
                    <img
                      src={episode.podcast.artworkSmall}
                      alt="Podcast artwork."
                      className="player__artwork"
                    />
                  </a>
                </Link>
              )}

              <button
                onClick={() => this.skipTime(-15)}
                type="button"
                className="player__control"
              >
                <Icon path={skipBackIcon} className="player__control-icon" />
              </button>
              <Mutation mutation={mutation}>
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
              <button
                onClick={() => this.skipTime(30)}
                type="button"
                className="player__control"
              >
                <Icon path={skipAheadIcon} className="player__control-icon" />
              </button>
              {episode && (
                <audio
                  ref={this.player}
                  src={episode ? episode.mediaUrl : null}
                  onLoadedMetadata={() => this.verifyDuration()}
                  onCanPlay={() => this.onCanPlay()}
                  onEnded={() => this.onEnded()}
                  preload="metadata"
                  autoPlay={false}
                  controls
                />
              )}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(PLAYING_EPISODE_ID_QUERY, {
    props: ({ data: { playingEpisodeId } }) => ({ playingEpisodeId }),
  }),
  graphql(PLAYING_STATUS_QUERY, {
    props: ({ data: { isPlaying } }) => ({ isPlaying }),
  }),
  graphql(PLAYER_STATUS_QUERY, {
    props: ({ data: { isPlayerOpen } }) => ({ isPlayerOpen }),
  }),
  graphql(OPEN_PLAYER_MUTATION, { name: 'openPlayer' }),
  graphql(UPDATE_TIME_MUTATION, { name: 'updateTime' })
)(Audioplayer);
