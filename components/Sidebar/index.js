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

import {
  Sidebar,
  LogoWrapper,
  Logo,
  LogoLink,
  Nav,
  Group,
  GroupLink,
  GroupIcon,
  GroupText,
} from './styles';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const SidebarComponent = () => (
  <Sidebar>
    <LogoWrapper>
      <Link href="/">
        <LogoLink>
          <Logo src="/static/logo.svg" alt="PodcastTune Logo" />
        </LogoLink>
      </Link>
    </LogoWrapper>

    <User>
      {({ data: { me } }) => (
        <Nav>
          <Group>
            <Link href="/search">
              <GroupLink>
                <GroupIcon path={searchIcon} />
                <GroupText className="nav__group-link">Search</GroupText>
              </GroupLink>
            </Link>
            <Link href="/discover">
              <GroupLink>
                <GroupIcon path={discoverIcon} />
                <GroupText className="nav__group-link">Discover</GroupText>
              </GroupLink>
            </Link>
            <Link href="/categories">
              <GroupLink>
                <GroupIcon path={categoriesIcon} />
                <GroupText className="nav__group-link">Categories</GroupText>
              </GroupLink>
            </Link>
          </Group>

          {!me && (
            <Group>
              <Login />
              <Register />
            </Group>
          )}

          {me && (
            <>
              <Group>
                <Link href="/podcasts">
                  <GroupLink>
                    <GroupIcon path={podcastsIcon} />
                    <GroupText className="nav__group-link">Podcasts</GroupText>
                  </GroupLink>
                </Link>
                <Link href="/inProgress">
                  <GroupLink>
                    <GroupIcon path={inProgressIcon} fix="true" />
                    <GroupText className="nav__group-link">
                      In Progress
                    </GroupText>
                  </GroupLink>
                </Link>
                <Link href="/favorites">
                  <GroupLink>
                    <GroupIcon path={favoritesIcon} fix="true" />
                    <GroupText className="nav__group-link">Favorites</GroupText>
                  </GroupLink>
                </Link>
              </Group>
              <Group>
                <Logout />
              </Group>
            </>
          )}
        </Nav>
      )}
    </User>
  </Sidebar>
);

export default SidebarComponent;
