import React, { Component } from 'react';

import { episodeType } from '../types';

class Episode extends Component {
  static propTypes = {
    episode: episodeType.isRequired,
  };

  render() {
    const { episode } = this.props;
    const { id, title, description, pubDate, podcast } = episode;
    const { artworkSmall } = podcast;

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
          <div className="episode__controls" />
        </div>
        {description && (
          <div className="episode__bottom-row">
            <p className="episode__description">{description}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Episode;
