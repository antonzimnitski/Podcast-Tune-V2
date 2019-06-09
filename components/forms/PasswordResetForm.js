import React from 'react';
import { Form, Field, withFormik } from 'formik';
import { object } from 'yup';

import Icon from '@mdi/react';
import {
  mdiInformation as warningIcon,
  mdiLock as passwordIcon,
} from '@mdi/js';

import { passwordRule, confirmPasswordRule } from './validationRules';

import ErrorMessage from '../ErrorMessage';

const PasswordResetForm = ({ errors, touched, isSubmitting }) => {
  const passwordError = !!(touched.password && errors.password);
  const confirmPasswordError = !!(
    touched.confirmPassword && errors.confirmPassword
  );

  return (
    <Form className="form">
      <fieldset
        className="form__fieldset"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {errors.apiError && <ErrorMessage error={errors.apiError} />}

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
              placeholder="New Password"
            />
          </div>
        </div>

        <div className="form__row">
          {confirmPasswordError && (
            <div className="form__error-wrapper">
              <Icon path={warningIcon} className="form__warning-icon" />
              <p className="form__error-message">{errors.confirmPassword}</p>
            </div>
          )}
          <div className="form__input-wrapper">
            <Icon path={passwordIcon} className="form__input-icon" />
            <Field
              className={`form__input${
                confirmPasswordError ? ' form__input--error' : ''
              }`}
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
            />
          </div>
        </div>
        <button
          className="btn btn--large"
          type="submit"
          disabled={isSubmitting}
        >
          Change my password
        </button>
      </fieldset>
    </Form>
  );
};

const validationSchema = object({
  password: passwordRule,
  confirmPassword: confirmPasswordRule,
});

export default withFormik({
  mapPropsToValues({ password, confirmPassword }) {
    return {
      password: password || '',
      confirmPassword: confirmPassword || '',
    };
  },
  validationSchema,
  validateOnBlur: false,
  validateOnChange: false,
  handleSubmit: async (values, { props, setSubmitting }) => {
    const { reset, resetToken } = props;
    try {
      await reset({
        variables: {
          resetToken,
          ...values,
        },
      });
    } catch (error) {
      setSubmitting(false);
    }
  },
})(PasswordResetForm);
