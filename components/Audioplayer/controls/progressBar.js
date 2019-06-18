import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { number, func, shape } from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

const UPDATE_TIME_MUTATION = gql`
  mutation($current: Float!, $max: Float!) {
    updateTime(current: $current, max: $max) @client
  }
`;
const TIME_QUERY = gql`
  query {
    time @client {
      current
      max
    }
  }
`;

class ProgressBar extends Component {
  state = {
    isChanging: false,
    time: {
      current: 0,
      max: 0,
    },
  };

  static propTypes = {
    updateTime: func.isRequired,
    time: shape({
      current: number,
      max: number,
    }).isRequired,
  };

  startChange = () => {
    const { time } = this.props;

    this.setState({
      isChanging: true,
      time: {
        current: time.current || 0,
        max: time.max || 0,
      },
    });
  };

  handleChange = val => {
    const { time } = this.props;

    this.setState({
      time: {
        ...time,
        current: val,
      },
    });
  };

  endChange = () => {
    const { updateTime } = this.props;
    const { time } = this.state;

    this.setState({
      transitioning: true,
      isChanging: false,
    });

    const player = document.getElementById('player');
    if (player) {
      player.currentTime = time.current;
    }

    setTimeout(() => {
      this.setState({
        transitioning: false,
      });
      updateTime({
        variables: {
          ...time,
        },
      });
    }, 200);
  };

  render() {
    const { time: propTime } = this.props;
    const { time: stateTime, isChanging, transitioning } = this.state;

    const time = isChanging || transitioning ? stateTime : propTime;
    // const range = Math.round((time.current / time.max) * 100);

    return (
      <div className="player__progress-bar progress-bar">
        <Slider
          className="progress-bar__slider"
          tooltip={false}
          value={time.current || 0}
          max={time.max || 1}
          onChange={this.handleChange}
          onChangeStart={this.startChange}
          onChangeComplete={this.endChange}
        />
      </div>
    );
  }
}

export default compose(
  graphql(TIME_QUERY, {
    props: ({ data: { time } }) => ({ time }),
  }),
  graphql(UPDATE_TIME_MUTATION, { name: 'updateTime' })
)(ProgressBar);
