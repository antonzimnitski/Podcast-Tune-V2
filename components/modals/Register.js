/* eslint-disable no-useless-escape */
/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

import { ModalConsumer } from './ModalContext';
import Login from './Login';
import { CURRENT_USER_QUERY } from '../User';
import RegisterForm from '../forms/RegisterForm';

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

        <Mutation
          mutation={REGISTER_MUTATION}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {register => <RegisterForm register={register} />}
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
