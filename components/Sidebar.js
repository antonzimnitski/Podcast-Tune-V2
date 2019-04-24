import React, { Component } from 'react';

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__logo logo">
          <a href="/" className="logo__wrapper">
            <img src="" alt="PodcastTune Logo" className="logo__image" />
          </a>
        </div>

        <div className="sidebar__nav nav">
          <div className="nav__group">
            <div className="nav__group-header">Menu</div>
            <div className="nav__group-item">
              <img src="" alt="" className="nav__group-icon" />
              <a href="/" className="nav__group-link">
                Discover
              </a>
            </div>
            <div className="nav__group-item">
              <img src="" alt="" className="nav__group-icon" />
              <a href="/" className="nav__group-link">
                Categories
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
