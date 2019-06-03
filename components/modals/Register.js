/* eslint-disable no-useless-escape */
/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';
import debounce from 'lodash.debounce';

import { ModalConsumer } from './ModalContext';
import Login from './Login';
import ErrorMessage from '../ErrorMessage';

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

  state = {
    name: '',
    email: '',
    password: '',
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
        if (value.length === 0) {
          emailValid = false;
          formErrors.email = "Value can't be empty";
          break;
        }
        // http://emailregex.com/
        emailValid = value.match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        formErrors.email = emailValid ? '' : 'Value is not a valid email.';
        break;
      case 'password':
        if (value.length === 0) {
          passwordValid = false;
          formErrors.password = "Value can't be empty";
          break;
        }

        passwordValid = value.length >= 6;
        formErrors.password = passwordValid
          ? ''
          : 'Value is too short( min 6 characters)';
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
    const { email, password, name, formValid, formErrors } = this.state;
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

        <Mutation mutation={REGISTER_MUTATION} variables={this.state}>
          {(register, { error, loading }) => (
            <form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await register();
                this.setState({
                  name: '',
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
                <label className="auth-modal__label" htmlFor="name">
                  Name:
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="auth-modal__input"
                    value={name}
                    onChange={this.saveToState}
                  />
                </label>
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
                  Create an Account
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
