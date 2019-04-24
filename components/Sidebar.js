import React, { Component } from 'react';
import Link from 'next/link';

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__logo logo">
          <Link href="/">
            <a className="logo__wrapper">
              <img src="" alt="PodcastTune Logo" className="logo__image" />
            </a>
          </Link>
        </div>

        <div className="sidebar__nav nav">
          <div className="nav__group">
            <div className="nav__group-header">Menu</div>
            <Link href="/">
              <a className="nav__group-item">
                <img src="" alt="" className="nav__group-icon" />
                <span className="nav__group-link">Discover</span>
              </a>
            </Link>
            <Link href="/">
              <a className="nav__group-item">
                <img src="" alt="" className="nav__group-icon" />
                <span className="nav__group-link">Categories</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export { Sidebar as default };
