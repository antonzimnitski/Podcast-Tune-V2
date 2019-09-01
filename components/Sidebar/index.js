import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';

import Icon from '@mdi/react';
import {
  mdiMagnify as searchIcon,
  mdiApps as discoverIcon,
  mdiFolderOutline as categoriesIcon,
  mdiMicrophone as podcastsIcon,
  mdiHeartMultiple as favoritesIcon,
  mdiCircleSlice3 as inProgressIcon,
} from '@mdi/js';

import User from './User';
import Logout from './Logout';
import Login from './Login';
import Register from './Register';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Sidebar = () => (
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

    <User>
      {({ data: { me } }) => (
        <div className="sidebar__nav nav">
          <div className="nav__group">
            <Link href="/search">
              <a className="nav__group-item">
                <Icon path={searchIcon} className="nav__group-icon" />
                <span className="nav__group-link">Search</span>
              </a>
            </Link>
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
          {!me && (
            <div className="nav__group">
              <Login />
              <Register />
            </div>
          )}

          {me && (
            <>
              <div className="nav__group">
                <Link href="/podcasts">
                  <a className="nav__group-item">
                    <Icon path={podcastsIcon} className="nav__group-icon" />
                    <span className="nav__group-link">Podcasts</span>
                  </a>
                </Link>
                <Link href="/inProgress">
                  <a className="nav__group-item">
                    <Icon
                      path={inProgressIcon}
                      className="nav__group-icon icon-fix"
                    />
                    <span className="nav__group-link">In Progress</span>
                  </a>
                </Link>
                <Link href="/favorites">
                  <a className="nav__group-item">
                    <Icon
                      path={favoritesIcon}
                      className="nav__group-icon icon-fix"
                    />
                    <span className="nav__group-link">Favorites</span>
                  </a>
                </Link>
              </div>
              <div className="nav__group">
                <Logout />
              </div>
            </>
          )}
        </div>
      )}
    </User>
  </div>
);

export default Sidebar;
