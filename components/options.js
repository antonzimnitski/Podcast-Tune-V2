/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';

import Icon from '@mdi/react';
import {
  mdiDotsHorizontal as moreIcon,
  mdiPlaylistPlus as addToQueueIcon,
} from '@mdi/js';

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
    const { current } = this.dropdownRef;

    if (current && !current.contains(event.target)) {
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
            <button type="button" className="options__item">
              <Icon
                className="options__item-icon options__item-icon--inverted"
                path={addToQueueIcon}
              />
              <span className="options__item-label">Play next</span>
            </button>

            <button type="button" className="options__item">
              <Icon className="options__item-icon" path={addToQueueIcon} />
              <span className="options__item-label">Play last</span>
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Options;
