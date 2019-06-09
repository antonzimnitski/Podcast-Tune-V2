import React from 'react';
import { Form, Field, withFormik } from 'formik';
import { object } from 'yup';

import Icon from '@mdi/react';
import {
  mdiInformation as warningIcon,
  mdiLock as passwordIcon,
  mdiEmail as emailIcon,
} from '@mdi/js';

import { emailRule, passwordRule } from './validationRules';
import ErrorMessage from '../ErrorMessage';

const LoginForm = ({ errors, touched, isSubmitting }) => {
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
          Log in
        </button>
      </fieldset>
    </Form>
  );
};

const validationSchema = object().shape({
  email: emailRule,
  password: passwordRule,
});

export default withFormik({
  mapPropsToValues({ email, password }) {
    return {
      email: email || '',
      password: password || '',
    };
  },
  validationSchema,
  validateOnBlur: false,
  validateOnChange: false,
  handleSubmit: async (values, { props, setFieldError, setSubmitting }) => {
    try {
      await props.login({
        variables: {
          ...values,
        },
      });
    } catch (error) {
      setFieldError('apiError', error);
      setSubmitting(false);
    }
  },
})(LoginForm);
