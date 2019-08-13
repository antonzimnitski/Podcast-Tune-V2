import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import Icon from '@mdi/react';
import { mdiMenu as upNextIcon, mdiWindowClose as closeIcon } from '@mdi/js';

const OPEN_UP_NEXT_MUTATION = gql`
  mutation {
    openUpNext @client
  }
`;

const CLOSE_UP_NEXT_MUTATION = gql`
  mutation {
    closeUpNext @client
  }
`;

const UP_NEXT_STATUS_QUERY = gql`
  query {
    isUpNextOpen @client
  }
`;

class UpNext extends Component {
  // static propTypes = {
  //   setPlaybackRate: func.isRequired,
  //   playbackRate: number.isRequired,
  // };

  handleClick = () => {
    const { isUpNextOpen, openUpNext, closeUpNext } = this.props;

    const method = isUpNextOpen ? closeUpNext : openUpNext;
    method();
  };

  render() {
    const { isUpNextOpen, closeUpNext } = this.props;

    console.log({ isUpNextOpen });
    return (
      <div className="player__up-next up-next">
        <button
          type="button"
          className="up-next__button"
          onClick={this.handleClick}
        >
          <Icon className="up-next__icon" path={upNextIcon} />
        </button>

        <div
          className={`up-next__popup ${
            isUpNextOpen ? ' up-next__popup--visible' : ''
          }`}
        >
          <div className="up-next__panel">
            <div className="up-next__title">Up Next</div>
            <button
              type="button"
              className="up-next__close"
              onClick={closeUpNext}
            >
              <Icon className="up-next__icon" path={closeIcon} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(UP_NEXT_STATUS_QUERY, {
    props: ({ data: { isUpNextOpen } }) => ({ isUpNextOpen }),
  }),
  graphql(OPEN_UP_NEXT_MUTATION, { name: 'openUpNext' }),
  graphql(CLOSE_UP_NEXT_MUTATION, { name: 'closeUpNext' })
)(UpNext);
