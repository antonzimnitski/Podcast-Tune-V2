import React, { Component } from 'react';

class Page extends Component {
  render() {
    const { feed } = this.props;

    if (feed.length < 1) return <p>No Episodes Found for Podcast</p>;

    return (
      <div className="previews__list">
        {feed.map(({ node: episode }) => {
          const { id: nodeId, title, duration, pubDate } = episode;

          return (
            <div key={nodeId}>
              <div>{title}</div>
              <div>{duration}</div>
              <div>{pubDate}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export { Page as default };
