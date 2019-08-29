/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, createRef } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import Icon from '@mdi/react';
import {
  mdiDotsHorizontal as moreIcon,
  mdiPlaylistPlus as addToQueueIcon,
  mdiPlaylistRemove as removeFromQueueIcon,
} from '@mdi/js';

import { CURRENT_USER_QUERY } from '../Sidebar/User';
import { GET_USER_QUEUE } from '../Audioplayer/controls/queue';
import { GET_USER_PLAYING_EPISODE } from '../Audioplayer';

const ADD_EPISODE_TO_USER_QUEUE_NEXT_MUTATION = gql`
  mutation($id: ID!) {
    addEpisodeToQueueNext(id: $id) {
      id
      position

      episode {
        id
        title
        isInQueue

        podcast {
          id
          title
          artworkSmall
        }
      }
    }
  }
`;

const ADD_EPISODE_TO_USER_QUEUE_LAST_MUTATION = gql`
  mutation($id: ID!) {
    addEpisodeToQueueLast(id: $id) {
      id
      position

      episode {
        id
        title
        isInQueue

        podcast {
          id
          title
          artworkSmall
        }
      }
    }
  }
`;

const REMOVE_EPISODE_FROM_USER_QUEUE_MUTATION = gql`
  mutation($id: ID!) {
    removeEpisodeFromQueue(id: $id) {
      id

      episode {
        id
        isInQueue
      }
    }
  }
`;

const Options = ({
  playingEpisode,
  episodeId,
  isInQueue,
  playNext,
  playLast,
  removeFromQueue,
}) => {
  const [isOpen, setOpenStatus] = useState(false);
  const dropdownRef = createRef();

  const onClose = () => {
    setOpenStatus(false);
    removeListener();
  };

  const onOptionsIconClick = () => {
    !isOpen ? addListener() : removeListener();

    setOpenStatus(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = event => {
      const { current } = dropdownRef;

      if (current && !current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    console.log(dropdownRef);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  const isPlayingEpisode =
    playingEpisode && playingEpisode.episode.id === episodeId;

  return (
    <div className="options">
      <button
        type="button"
        className={`options__button ${isOpen ? 'options__button--open' : ''}`}
        onClick={onOptionsIconClick}
      >
        <Icon className="options__icon" path={moreIcon} />
        <span className="options__label" title="More">
          More
        </span>
      </button>

      {isOpen && (
        <div ref={dropdownRef} className="options__dropdown">
          {isInQueue || isPlayingEpisode ? (
            <button
              type="button"
              className="options__item"
              onClick={() => {
                removeFromQueue();
                onClose();
              }}
            >
              <Icon
                className="options__item-icon options__item-icon--inverted"
                path={removeFromQueueIcon}
              />
              <span className="options__item-label">Remove from Up Next</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                className="options__item"
                onClick={() => {
                  playNext();
                  onClose();
                }}
              >
                <Icon
                  className="options__item-icon options__item-icon--inverted"
                  path={addToQueueIcon}
                />
                <span className="options__item-label">Play next</span>
              </button>
              <button
                type="button"
                className="options__item"
                onClick={() => {
                  playLast();
                  onClose();
                }}
              >
                <Icon className="options__item-icon" path={addToQueueIcon} />
                <span className="options__item-label">Play last</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export { REMOVE_EPISODE_FROM_USER_QUEUE_MUTATION };

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(GET_USER_PLAYING_EPISODE, {
    props: ({ data: { playingEpisode } }) => ({
      playingEpisode,
    }),
    skip: props => !props.me,
  }),
  graphql(ADD_EPISODE_TO_USER_QUEUE_NEXT_MUTATION, {
    name: 'playNext',
    skip: props => !props.me,
    options: ({ episodeId }) => ({
      variables: {
        id: episodeId,
      },
      refetchQueries: [
        { query: GET_USER_QUEUE },
        { query: GET_USER_PLAYING_EPISODE },
      ],
    }),
  }),
  graphql(ADD_EPISODE_TO_USER_QUEUE_LAST_MUTATION, {
    name: 'playLast',
    skip: props => !props.me,
    options: ({ episodeId }) => ({
      variables: {
        id: episodeId,
      },
      refetchQueries: [
        { query: GET_USER_QUEUE },
        { query: GET_USER_PLAYING_EPISODE },
      ],
    }),
  }),
  graphql(REMOVE_EPISODE_FROM_USER_QUEUE_MUTATION, {
    name: 'removeFromQueue',
    skip: props => !props.me,
    options: ({ episodeId }) => ({
      variables: {
        id: episodeId,
      },
      refetchQueries: [
        { query: GET_USER_QUEUE },
        { query: GET_USER_PLAYING_EPISODE },
      ],
    }),
  })
)(Options);
