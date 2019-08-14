/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { func, bool } from 'prop-types';

import Icon from '@mdi/react';
import { mdiMenu as upNextIcon, mdiWindowClose as closeIcon } from '@mdi/js';

import { CURRENT_USER_QUERY } from '../../Sidebar/User';
import QueueEpisode from './queueEpisode';

const OPEN_QUEUE_MUTATION = gql`
  mutation {
    openQueue @client
  }
`;

const CLOSE_QUEUE_MUTATION = gql`
  mutation {
    closeQueue @client
  }
`;

const QUEUE_STATUS_QUERY = gql`
  query {
    isQueueOpen @client
  }
`;

const GET_USER_QUEUE = gql`
  query GET_USER_QUEUE {
    queue {
      id

      position
      episode {
        id
        title

        podcast {
          id
          title
          artworkSmall
        }
      }
    }
  }
`;

class Queue extends Component {
  static propTypes = {
    isQueueOpen: bool.isRequired,
    openQueue: func.isRequired,
    closeQueue: func.isRequired,
  };

  handleClick = () => {
    const { isQueueOpen, openQueue, closeQueue } = this.props;

    const method = isQueueOpen ? closeQueue : openQueue;
    method();
  };

  render() {
    const { isQueueOpen, closeQueue, queue } = this.props;

    console.log({ queue });
    return (
      <div className="player__queue queue">
        <button
          type="button"
          className="queue__button"
          onClick={this.handleClick}
        >
          <Icon className="queue__icon" path={upNextIcon} />
        </button>

        <div
          className={`queue__popup ${
            isQueueOpen ? ' queue__popup--visible' : ''
          }`}
        >
          <div
            className="queue__panel"
            role="presentation"
            onKeyDown={closeQueue}
            onClick={closeQueue}
          >
            <div className="queue__title">Up Next</div>
            <button type="button" className="queue__close" onClick={closeQueue}>
              <Icon className="queue__icon" path={closeIcon} />
            </button>
          </div>
          <div className="queue__list">
            {(queue || []).map(({ position, episode }) => (
              <QueueEpisode key={position} episode={episode} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export { GET_USER_QUEUE };
export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(QUEUE_STATUS_QUERY, {
    props: ({ data: { isQueueOpen } }) => ({ isQueueOpen }),
  }),
  graphql(OPEN_QUEUE_MUTATION, { name: 'openQueue' }),
  graphql(CLOSE_QUEUE_MUTATION, { name: 'closeQueue' }),
  graphql(GET_USER_QUEUE, {
    props: ({ data: { loading, error, queue } }) => ({
      loading,
      error,
      queue,
    }),
    skip: props => !props.me || !props.isQueueOpen, // Fix later
  })
)(Queue);
