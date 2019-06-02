import React, { Component } from 'react';
import Modal from 'react-modal';

import { ModalConsumer } from './ModalContext';
import Register from './Register';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
    };

    this.email = React.createRef();
    this.password = React.createRef();
  }

  onSubmit(event) {
    event.preventDefault();

    const email = this.email.current.value.trim();
    const password = this.password.current.value.trim();
  }

  render() {
    const { onRequestClose } = this.props;
    return (
      <Modal
        isOpen
        onRequestClose={onRequestClose}
        className="auth-modal"
        overlayClassName="auth-modal__overlay"
      >
        <div className="modal__header">
          <h2 className="modal__title">Login</h2>
          <ModalConsumer>
            {({ hideModal }) => (
              <button className="modal__close" onClick={() => hideModal()} />
            )}
          </ModalConsumer>
        </div>
        {this.state.error ? (
          <p className="auth-modal__error">{this.state.error}</p>
        ) : (
          undefined
        )}
        <form onSubmit={e => this.onSubmit(e)}>
          <label className="auth-modal__label" htmlFor="email">
            Email: *
          </label>
          <input
            type="email"
            ref={this.email}
            id="email"
            name="email"
            placeholder="Email"
            className="auth-modal__input"
          />

          <label className="auth-modal__label" htmlFor="password">
            Password: *
          </label>
          <input
            type="password"
            ref={this.password}
            id="password"
            name="password"
            placeholder="Password"
            className="auth-modal__input"
          />
          <button type="submit" className="btn btn--large">
            Login
          </button>
        </form>
        <ModalConsumer>
          {({ showModal }) => (
            <button
              className="auth-modal__text-btn"
              onClick={() => showModal(Register)}
            >
              Don't have an account?
            </button>
          )}
        </ModalConsumer>
      </Modal>
    );
  }
}

export default Login;