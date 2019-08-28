import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { string } from 'prop-types';

import ErrorMessage from '../components/ErrorMessage';
import { CURRENT_USER_QUERY } from '../components/Sidebar/User';
import PasswordResetForm from '../components/forms/PasswordResetForm';
import { urlQueryType } from '../types';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const Reset = ({ query: { resetToken } }) => (
  <Mutation
    mutation={RESET_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(reset, { error, loading }) => (
      <>
        <p>Please use the form below to set a new password.</p>
        <ErrorMessage error={error} />
        <PasswordResetForm resetToken={resetToken} reset={reset} />
      </>
    )}
  </Mutation>
);

export default Reset;

Reset.propTypes = {
  query: urlQueryType,
  resetToken: string.isRequired,
};
