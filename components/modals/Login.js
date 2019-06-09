/* eslint-disable import/no-cycle */
import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

import LoginForm from '../forms/LoginForm';
import ErrorMessage from '../ErrorMessage';

import { CURRENT_USER_QUERY } from '../User';
import { OPEN_MODAL_MUTATION, REGISTER, REQUEST_RESET } from './index';

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

const Login = ({ closeModal }) => (
  <>
    <div className="modal__header">
      <h2 className="modal__title">Log in</h2>

      <button
        type="button"
        className="modal__close"
        onClick={() => closeModal()}
      />
    </div>
    <Mutation
      mutation={LOGIN_MUTATION}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {login => <LoginForm login={login} />}
    </Mutation>

    <Mutation
      mutation={OPEN_MODAL_MUTATION}
      variables={{ modalType: REQUEST_RESET }}
    >
      {openModal => (
        <button className="text-btn" type="button" onClick={() => openModal()}>
          Forgot your password?
        </button>
      )}
    </Mutation>

    <Mutation
      mutation={OPEN_MODAL_MUTATION}
      variables={{ modalType: REGISTER }}
    >
      {openModal => (
        <button className="text-btn" type="button" onClick={() => openModal()}>
          Don't have an account?
        </button>
      )}
    </Mutation>
  </>
);

export default Login;

Login.propTypes = {
  closeModal: func.isRequired,
};
