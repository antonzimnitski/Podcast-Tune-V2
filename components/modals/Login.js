/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

import LoginForm from '../forms/LoginForm';
import { ModalConsumer } from './ModalContext';
import Register from './Register';
import RequestReset from './RequestReset';
import ErrorMessage from '../ErrorMessage';
import { CURRENT_USER_QUERY } from '../User';

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
          <h2 className="modal__title">Log in</h2>
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
        <Mutation
          mutation={LOGIN_MUTATION}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {login => <LoginForm login={login} />}
        </Mutation>
        <ModalConsumer>
          {({ showModal }) => (
            <button
              type="button"
              className="auth-modal__text-btn"
              onClick={() => showModal(RequestReset)}
            >
              Forgot your password?
            </button>
          )}
        </ModalConsumer>

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
