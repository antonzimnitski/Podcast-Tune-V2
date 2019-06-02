/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

import { ModalConsumer } from './ModalContext';
import Login from './Login';

const REGISTER_MUTATION = gql`
  mutation REGISTER_MUTATION(
    $email: String!
    $password: String!
    $name: String
  ) {
    register(email: $email, password: $password, name: $name) {
      id
      name
      email
    }
  }
`;

class Register extends Component {
  static propTypes = {
    onRequestClose: func.isRequired,
  };

  state = {
    name: '',
    email: '',
    password: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password, name } = this.state;
    const { onRequestClose } = this.props;

    return (
      <Modal
        isOpen
        onRequestClose={onRequestClose}
        className="auth-modal"
        overlayClassName="auth-modal__overlay"
      >
        <div className="modal__header">
          <h2 className="modal__title">Register</h2>
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

        <Mutation mutation={REGISTER_MUTATION} variables={this.state}>
          {(register, { error, loading }) => (
            <form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await register();
                this.setState({
                  email: '',
                  password: '',
                  name: '',
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
                <label className="auth-modal__label" htmlFor="name">
                  Name:
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="auth-modal__input"
                    value={name}
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
                  Create an Account
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
              onClick={() => showModal(Login)}
            >
              Have an account?
            </button>
          )}
        </ModalConsumer>
      </Modal>
    );
  }
}

export default Register;
