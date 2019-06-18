/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { number, func, bool } from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

import Icon from '@mdi/react';
import {
  mdiVolumeHigh as volumeHighIcon,
  mdiVolumeMedium as volumeMediumIcon,
  mdiVolumeLow as volumeLowIcon,
  mdiVolumeOff as volumeOffIcon,
} from '@mdi/js';

const CHANGE_VOLUME_MUTATION = gql`
  mutation($volume: Float!) {
    changeVolume(volume: $volume) @client
  }
`;

const MUTE_MUTATION = gql`
  mutation {
    mute @client
  }
`;

const UNMUTE_MUTATION = gql`
  mutation {
    unmute @client
  }
`;

const VOLUME_QUERY = gql`
  query {
    volume @client
  }
`;

const MUTE_STATUS_QUERY = gql`
  query {
    isMuted @client
  }
`;

class Volume extends Component {
  static propTypes = {
    setVolume: func.isRequired,
    mute: func.isRequired,
    unmute: func.isRequired,
    isMuted: bool.isRequired,
    volume: number.isRequired,
  };

  handleChange = val => {
    const { setVolume } = this.props;

    setVolume({
      variables: {
        volume: val / 100,
      },
    });
  };

  handleMute = () => {
    const { isMuted, mute, unmute } = this.props;

    isMuted ? unmute() : mute();
  };

  render() {
    const { volume, isMuted } = this.props;

    let icon;

    switch (true) {
      case isMuted || volume === 0:
        icon = volumeOffIcon;
        break;

      case volume <= 0.32 && volume !== 0:
        icon = volumeLowIcon;
        break;

      case volume <= 0.65 && volume > 0.32:
        icon = volumeMediumIcon;
        break;

      default:
        icon = volumeHighIcon;
        break;
    }

    return (
      <div className="player__volume volume">
        <button
          type="button"
          className="volume__button"
          onClick={this.handleMute}
        >
          <Icon className="volume__icon" path={icon} />
        </button>
        <div className="volume__slider-wrapper">
          <Slider
            min={0}
            max={100}
            className="volume__slider"
            tooltip={false}
            value={isMuted ? 0 : volume * 100}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(VOLUME_QUERY, {
    props: ({ data: { volume } }) => ({ volume }),
  }),
  graphql(MUTE_STATUS_QUERY, {
    props: ({ data: { isMuted } }) => ({ isMuted }),
  }),
  graphql(CHANGE_VOLUME_MUTATION, { name: 'setVolume' }),
  graphql(MUTE_MUTATION, { name: 'mute' }),
  graphql(UNMUTE_MUTATION, { name: 'unmute' })
)(Volume);
