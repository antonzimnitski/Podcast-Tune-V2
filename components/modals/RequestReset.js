import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

import RequestResetForm from '../forms/RequestResetForm';

import ErrorMessage from '../ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const RequestReset = ({ closeModal }) => (
  <>
    <div className="modal__header">
      <h2 className="modal__title">Password Reset</h2>

      <button
        type="button"
        className="modal__close"
        onClick={() => closeModal()}
      />
    </div>
    <Mutation mutation={REQUEST_RESET_MUTATION}>
      {(requestReset, { error, loading, called }) => (
        <>
          <ErrorMessage error={error} />
          {!error && !loading && called && (
            <p>
              Instructions for resetting your password have been emailed to you.
            </p>
          )}
          <RequestResetForm requestReset={requestReset} />
        </>
      )}
    </Mutation>
  </>
);

export default RequestReset;

RequestReset.propTypes = {
  closeModal: func.isRequired,
};
