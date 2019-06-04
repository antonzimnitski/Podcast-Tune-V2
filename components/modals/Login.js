/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';
import debounce from 'lodash.debounce';

import { ModalConsumer } from './ModalContext';
import Register from './Register';
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

  state = {
    password: '',
    email: '',
    formErrors: { email: '', password: '' },
    emailValid: false,
    passwordValid: false,
    formValid: false,
  };

  validateField = (name, value) => {
    const { formErrors } = this.state;
    let { emailValid, passwordValid } = this.state;

    switch (name) {
      case 'email':
        emailValid = value.length !== 0;
        formErrors.email = emailValid ? '' : "Value can't be empty";
        break;
      case 'password':
        passwordValid = value.length !== 0;
        formErrors.password = passwordValid ? '' : "Value can't be empty";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors,
        emailValid,
        passwordValid,
      },
      this.validateForm
    );
  };

  validateForm = () => {
    const { emailValid, passwordValid } = this.state;

    this.setState({
      formValid: emailValid && passwordValid,
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
    const { email, password, formValid, formErrors } = this.state;
    const { email: emailError, password: passwordError } = formErrors;
    const { onRequestClose } = this.props;

    return (
      <Modal
        isOpen
        onRequestClose={onRequestClose}
        className="auth-modal"
        overlayClassName="auth-modal__overlay"
      >
        <div className="modal__header">
          <h2 className="modal__title">Login</h2>
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
          variables={this.state}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {(login, { error, loading }) => (
            <form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await login();
                this.setState({
                  email: '',
                  password: '',
                  formErrors: { email: '', password: '' },
                  emailValid: false,
                  passwordValid: false,
                  formValid: false,
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <ErrorMessage error={error} />
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
                    onBlur={e =>
                      this.validateField(e.target.name, e.target.value)
                    }
                  />
                </label>
                {passwordError && (
                  <p className="auth-modal__error">{passwordError}</p>
                )}
                <button
                  disabled={!formValid}
                  type="submit"
                  className="btn btn--large"
                >
                  Login
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
