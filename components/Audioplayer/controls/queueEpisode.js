import React from 'react';

import Icon from '@mdi/react';
import { mdiStar as favouriteIcon, mdiPlay as playIcon } from '@mdi/js';

const queueEpisode = ({ episode }) => {
  const { title, podcast } = episode;

  console.log(episode);

  return (
    <div className="queue-episode">
      <div className="queue-episode__artwork-wrapper">
        <div
          className="queue-episode__artwork"
          style={{
            backgroundImage: `url("${podcast.artworkSmall}")`,
          }}
        />

        <button type="button" className="queue-episode__play-btn">
          <Icon className="queue-episode__play-icon" path={playIcon} />
        </button>
      </div>
      <div className="queue-episode__details">
        <div className="queue-episode__title">{title}</div>
        <div className="queue-episode__podcast-name">{podcast.title}</div>
      </div>
      <div className="queue-episode__actions">
        <button type="button" className="queue-episode__favourite">
          <Icon className="queue-episode__icon" path={favouriteIcon} />
        </button>
      </div>
    </div>
  );
};
export default queueEpisode;
