import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { number, func } from 'prop-types';

import Icon from '@mdi/react';
import {
  mdiMinusCircle as decreaseIcon,
  mdiPlusCircle as increaseIcon,
} from '@mdi/js';

const CHANGE_PLAYBACK_RATE_MUTATION = gql`
  mutation($playbackRate: Float!) {
    changePlaybackRate(playbackRate: $playbackRate) @client
  }
`;

const PLAYBACK_RATE_QUERY = gql`
  query {
    playbackRate @client
  }
`;

class PlaybackRate extends Component {
  static propTypes = {
    setPlaybackRate: func.isRequired,
    playbackRate: number.isRequired,
  };

  increasePlaybackRate = () => {
    this.setPlaybackRate(0.1);
  };

  decreasePlaybackRate = () => {
    this.setPlaybackRate(-0.1);
  };

  setPlaybackRate = value => {
    const { setPlaybackRate, playbackRate } = this.props;

    const newPlaybackRate = +(playbackRate + value).toFixed(1);

    setPlaybackRate({
      variables: {
        playbackRate: newPlaybackRate,
      },
    });
  };

  render() {
    const { playbackRate } = this.props;

    return (
      <div className="player__playback-rate playback-rate">
        <button
          disabled={playbackRate === 4}
          type="button"
          className="playback-rate__control"
          onClick={() => this.increasePlaybackRate()}
        >
          <Icon className="playback-rate__icon" path={increaseIcon} />
        </button>
        <div className="playback-rate__text">{playbackRate}x</div>
        <button
          disabled={playbackRate === 0.5}
          type="button"
          className="playback-rate__control"
          onClick={() => this.decreasePlaybackRate()}
        >
          <Icon className="playback-rate__icon" path={decreaseIcon} />
        </button>
      </div>
    );
  }
}

export default compose(
  graphql(PLAYBACK_RATE_QUERY, {
    props: ({ data: { playbackRate } }) => ({ playbackRate }),
  }),
  graphql(CHANGE_PLAYBACK_RATE_MUTATION, { name: 'setPlaybackRate' })
)(PlaybackRate);
