import React from 'react';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import Icon from '@mdi/react';
import {
  mdiInformation as warningIcon,
  mdiLock as passwordIcon,
  mdiAccount as nameIcon,
  mdiEmail as emailIcon,
} from '@mdi/js';

import ErrorMessage from '../ErrorMessage';

const RegisterForm = ({ errors, touched, isSubmitting }) => {
  const emailError = !!(touched.email && errors.email);
  const passwordError = !!(touched.password && errors.password);

  return (
    <Form className="form">
      <fieldset
        className="form__fieldset"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {errors.apiError && <ErrorMessage error={errors.apiError} />}

        <div className="form__row">
          {emailError && (
            <div className="form__error-wrapper">
              <Icon path={warningIcon} className="form__warning-icon" />
              <p className="form__error-message">{errors.email}</p>
            </div>
          )}

          <div className="form__input-wrapper">
            <Icon path={emailIcon} className="form__input-icon" />
            <Field
              className={`form__input${
                emailError ? ' form__input--error' : ''
              }`}
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>
        </div>

        <div className="form__row">
          <div className="form__input-wrapper">
            <Icon path={nameIcon} className="form__input-icon" />
            <Field
              className="form__input"
              type="text"
              name="name"
              placeholder="Your Name"
            />
          </div>
        </div>

        <div className="form__row">
          {passwordError && (
            <div className="form__error-wrapper">
              <Icon path={warningIcon} className="form__warning-icon" />
              <p className="form__error-message">{errors.password}</p>
            </div>
          )}
          <div className="form__input-wrapper">
            <Icon path={passwordIcon} className="form__input-icon" />
            <Field
              className={`form__input${
                passwordError ? ' form__input--error' : ''
              }`}
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
        </div>

        <button
          className="btn btn--large"
          type="submit"
          disabled={isSubmitting}
        >
          Create an Account
        </button>
      </fieldset>
    </Form>
  );
};

const emailRequired = 'Email is required';
const passwordRequired = 'Password is required';
const passwordNotLongEnough = 'Password must be at least 9 characters';
const invalidEmail = "Email isn't valid";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .min(3)
    .max(255)
    .email(invalidEmail)
    .required(emailRequired),
  password: Yup.string()
    .min(9, passwordNotLongEnough)
    .max(255)
    .required(passwordRequired),
});

export default withFormik({
  mapPropsToValues({ email, name, password }) {
    return {
      email: email || '',
      name: name || '',
      password: password || '',
    };
  },
  validationSchema,
  validateOnBlur: false,
  validateOnChange: false,
  handleSubmit: async (values, { props, setFieldError, setSubmitting }) => {
    try {
      await props.register({
        variables: {
          ...values,
        },
      });
    } catch (error) {
      setFieldError('apiError', error);
      setSubmitting(false);
    }
  },
})(RegisterForm);
