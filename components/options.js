/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';

import Icon from '@mdi/react';
import { mdiDotsHorizontal as moreIcon } from '@mdi/js';

class Options extends Component {
  constructor() {
    super();

    this.state = {
      isOpen: false,
    };

    this.dropdownRef = React.createRef();
  }

  onOptionsIconClick = () => {
    console.log('onOptionsItemCLick');
    const { isOpen } = this.state;
    !isOpen ? this.addListener() : this.removeListener();

    this.setState({ isOpen: !isOpen });
  };

  addListener = () => {
    console.log('addListener');
    document.addEventListener('click', this.handleOutsideClick);
  };

  removeListener = () => {
    console.log('removeListener');
    document.removeEventListener('click', this.handleOutsideClick);
  };

  handleOutsideClick = event => {
    if (!this.dropdownRef.current.contains(event.target)) {
      this.onClose();
    }
  };

  onClose = () => {
    this.setState({ isOpen: false });
    this.removeListener();
  };

  render() {
    const { isOpen } = this.state;

    return (
      <div className="options">
        <button
          type="button"
          className={`options__button ${isOpen ? 'options__button--open' : ''}`}
          onClick={this.onOptionsIconClick}
        >
          <Icon className="options__icon" path={moreIcon} />
          <span className="options__label" title="More">
            More
          </span>
        </button>

        {isOpen && (
          <div ref={this.dropdownRef} className="options__dropdown">
            <div>Hello there</div>
          </div>
        )}
      </div>
    );
  }
}

export default Options;
