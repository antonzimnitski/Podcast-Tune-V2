import React, { Component } from 'react';
import { node } from 'prop-types';

import Sidebar from './Sidebar';
import Meta from './Meta';

class Page extends Component {
  static propTypes = {
    children: node,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    const { children } = this.props;

    return (
      <div className="app">
        <Meta />
        <Sidebar />
        <div className="content">
          <div className="main">{children}</div>
        </div>
      </div>
    );
  }
}

export { Page as default };
