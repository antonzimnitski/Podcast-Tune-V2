/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */

/*
  https://medium.com/@BogdanSoare/how-to-use-reacts-new-context-api-to-easily-manage-modals-2ae45c7def81
*/

import React, { Component, createContext } from 'react';

import { childrenType, childrenTypeDefault } from '../../types';

const ModalContext = createContext({
  component: null,
  props: {},
  showModal: () => {},
  hideModal: () => {},
});

export class ModalProvider extends Component {
  static propTypes = {
    children: childrenType,
  };

  static defaultProps = {
    children: childrenTypeDefault,
  };

  showModal = (component, props = {}) => {
    this.setState({
      component,
      props,
    });
  };

  hideModal = () =>
    this.setState({
      component: null,
      props: {},
    });

  state = {
    component: null,
    props: {},
    showModal: this.showModal,
    hideModal: this.hideModal,
  };

  render() {
    const { children } = this.props;

    return (
      <ModalContext.Provider value={this.state}>
        {children}
      </ModalContext.Provider>
    );
  }
}

export const ModalConsumer = ModalContext.Consumer;
