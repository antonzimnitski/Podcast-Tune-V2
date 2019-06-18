import React, { Component } from 'react';

import { childrenType, childrenTypeDefault } from '../types';
import Sidebar from './Sidebar';
import Meta from './Meta';
import ModalRoot from './modals';
import Audioplayer from './Audioplayer';

class Page extends Component {
  static propTypes = {
    children: childrenType,
  };

  static defaultProps = {
    children: childrenTypeDefault,
  };

  render() {
    const { children } = this.props;

    return (
      <div className="app">
        <Meta />
        <div className="main">
          <Sidebar />
          <div className="content">{children}</div>
        </div>
        <Audioplayer />
        <ModalRoot />
      </div>
    );
  }
}

export { Page as default };
