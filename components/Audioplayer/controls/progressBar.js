import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

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

  startChange = () => {
    const { time } = this.props;

    this.setState(
      {
        isChanging: true,
        time: {
          current: time.current || 0,
          max: time.max || 0,
        },
      },
      () => console.log('startChange', { time, stateTime: this.state.time })
    );
  };

  handleChange = val => {
    const { time } = this.props;

    this.setState(
      {
        time: {
          ...time,
          current: val,
        },
      },
      () => console.log('handleChange', { time, stateTime: this.state.time })
    );
  };

  endChange = val => {
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

    console.log({ propTime, stateTime, time });

    return (
      <Slider
        className="scrubber"
        tooltip={false}
        value={time.current || 0}
        max={time.max || 1}
        onChange={this.handleChange}
        onChangeStart={this.startChange}
        onChangeComplete={this.endChange}
      />
    );
  }
}

export default compose(
  graphql(TIME_QUERY, {
    props: ({ data: { time } }) => ({ time }),
  }),
  graphql(UPDATE_TIME_MUTATION, { name: 'updateTime' })
)(ProgressBar);
