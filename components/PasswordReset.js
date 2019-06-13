import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { string } from 'prop-types';

import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './Sidebar/User';
import PasswordResetForm from './forms/PasswordResetForm';

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

class PasswordReset extends Component {
  static propTypes = {
    resetToken: string.isRequired,
  };

  render() {
    const { resetToken } = this.props;

    return (
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
  }
}

export default PasswordReset;
