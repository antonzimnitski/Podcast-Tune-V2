/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

import { ModalConsumer } from './ModalContext';
import RequestResetForm from '../forms/RequestResetForm';

import ErrorMessage from '../ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
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
          <h2 className="modal__title">Password Reset</h2>
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
        <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
          {(requestReset, { error, loading, called }) => (
            <>
              <ErrorMessage error={error} />
              {!error && !loading && called && (
                <p>
                  Instructions for resetting your password have been emailed to
                  you.
                </p>
              )}
              <RequestResetForm requestReset={requestReset} />
            </>
          )}
        </Mutation>
      </Modal>
    );
  }
}

export default RequestReset;
