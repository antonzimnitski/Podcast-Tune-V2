import React, { Component } from 'react';

import { childrenType, childrenTypeDefault } from '../types';
import Sidebar from './Sidebar';
import Meta from './Meta';
import ModalRoot from './modals';

import { ModalProvider } from './modals/ModalContext';

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
      <ModalProvider>
        <div className="app">
          <Meta />
          <Sidebar />
          <div className="content">{children}</div>
          <ModalRoot />
        </div>
      </ModalProvider>
    );
  }
}

export { Page as default };
