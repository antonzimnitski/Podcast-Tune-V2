/* eslint-disable import/no-cycle */
import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

import { CURRENT_USER_QUERY } from '../Sidebar/User';
import RegisterForm from '../forms/RegisterForm';

import { OPEN_MODAL_MUTATION, LOGIN } from './index';

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

const Register = ({ closeModal }) => (
  <>
    <div className="modal__header">
      <h2 className="modal__title">Register</h2>

      <button
        type="button"
        className="modal__close"
        onClick={() => closeModal()}
      />
    </div>
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={REGISTER_MUTATION}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {register => (
            <RegisterForm
              register={register}
              onClose={() => {
                closeModal();
                client.resetStore();
              }}
            />
          )}
        </Mutation>
      )}
    </ApolloConsumer>

    <Mutation mutation={OPEN_MODAL_MUTATION} variables={{ modalType: LOGIN }}>
      {openModal => (
        <button className="text-btn" type="button" onClick={() => openModal()}>
          Already have an account?
        </button>
      )}
    </Mutation>
  </>
);

export default Register;

Register.propTypes = {
  closeModal: func.isRequired,
};
