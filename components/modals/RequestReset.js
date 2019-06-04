/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';
import debounce from 'lodash.debounce';

import { ModalConsumer } from './ModalContext';
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

  state = {
    email: '',
    formErrors: { email: '', password: '' },
    emailValid: false,
    formValid: false,
  };

  validateField = (name, value) => {
    const { formErrors } = this.state;
    let { emailValid } = this.state;

    switch (name) {
      case 'email':
        emailValid = value.length !== 0;
        formErrors.email = emailValid ? '' : "Value can't be empty";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors,
        emailValid,
      },
      this.validateForm
    );
  };

  validateForm = () => {
    const { emailValid } = this.state;

    this.setState({
      formValid: emailValid,
    });
  };

  saveToState = e => {
    const { name, value } = e.target;

    this.setState(
      { [name]: value },
      debounce(() => this.validateField(name, value), 300)
    );
  };

  render() {
    const { email, formValid, formErrors } = this.state;
    const { email: emailError } = formErrors;
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
            <form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await requestReset();
                this.setState({
                  email: '',
                  formErrors: { email: '' },
                  emailValid: false,
                  formValid: false,
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <ErrorMessage error={error} />
                {!error && !loading && called && (
                  <p>
                    Instructions for resetting your password have been emailed
                    to you.
                  </p>
                )}
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
                    onBlur={e =>
                      this.validateField(e.target.name, e.target.value)
                    }
                  />
                </label>
                {emailError && (
                  <p className="auth-modal__error">{emailError}</p>
                )}
                <button
                  disabled={!formValid}
                  type="submit"
                  className="btn btn--large"
                >
                  Reset my password
                </button>
              </fieldset>
            </form>
          )}
        </Mutation>
      </Modal>
    );
  }
}

export default RequestReset;
