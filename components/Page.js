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
      <div>
        <Meta />
        <Sidebar />
        {children}
      </div>
    );
  }
}

export { Page as default };
