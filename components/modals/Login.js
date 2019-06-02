/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

import { ModalConsumer } from './ModalContext';
import Register from './Register';

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class Login extends Component {
  static propTypes = {
    onRequestClose: func.isRequired,
  };

  state = {
    password: '',
    email: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password } = this.state;
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
              <button
                type="button"
                className="modal__close"
                onClick={() => hideModal()}
              />
            )}
          </ModalConsumer>
        </div>
        <Mutation mutation={LOGIN_MUTATION} variables={this.state}>
          {(login, { error, loading }) => (
            <form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await login();
                this.setState({
                  email: '',
                  password: '',
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <label className="auth-modal__label" htmlFor="email">
                  Email: *
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="auth-modal__input"
                    required
                    value={email}
                    onChange={this.saveToState}
                  />
                </label>
                <label className="auth-modal__label" htmlFor="password">
                  Password: *
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="auth-modal__input"
                    required
                    value={password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit" className="btn btn--large">
                  Login
                </button>
              </fieldset>
            </form>
          )}
        </Mutation>
        <ModalConsumer>
          {({ showModal }) => (
            <button
              type="button"
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
