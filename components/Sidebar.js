import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';

import Icon from '@mdi/react';
import {
  mdiApps as discoverIcon,
  mdiFolderOutline as categoriesIcon,
} from '@mdi/js';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__logo logo">
          <Link href="/">
            <a className="logo__wrapper">
              <img
                src="/static/logo.svg"
                alt="PodcastTune Logo"
                className="logo__image"
              />
            </a>
          </Link>
        </div>

        <div className="sidebar__nav nav">
          <div className="nav__group">
            <Link href="/discover">
              <a className="nav__group-item">
                <Icon path={discoverIcon} className="nav__group-icon" />
                <span className="nav__group-link">Discover</span>
              </a>
            </Link>
            <Link href="/categories">
              <a className="nav__group-item">
                <Icon path={categoriesIcon} className="nav__group-icon" />
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
