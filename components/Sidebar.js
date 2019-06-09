import React from 'react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';

import Icon from '@mdi/react';
import {
  mdiMagnify as searchIcon,
  mdiApps as discoverIcon,
  mdiFolderOutline as categoriesIcon,
} from '@mdi/js';

import User from './User';
import Logout from './Logout';

import { OPEN_MODAL_MUTATION, LOGIN, REGISTER } from './modals';

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
              <Mutation
                mutation={OPEN_MODAL_MUTATION}
                variables={{ modalType: LOGIN }}
              >
                {openModal => (
                  <button
                    className="nav__group-button"
                    type="button"
                    onClick={() => openModal()}
                  >
                    Log in
                  </button>
                )}
              </Mutation>
              <Mutation
                mutation={OPEN_MODAL_MUTATION}
                variables={{ modalType: REGISTER }}
              >
                {openModal => (
                  <button
                    className="nav__group-button"
                    type="button"
                    onClick={() => openModal()}
                  >
                    Register
                  </button>
                )}
              </Mutation>
            </div>
          )}

          {me && (
            <div className="nav__group">
              <Logout />
            </div>
          )}
        </div>
      )}
    </User>
  </div>
);

export default Sidebar;
