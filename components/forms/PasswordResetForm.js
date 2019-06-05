import React from 'react';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import ErrorMessage from '../ErrorMessage';

const PasswordResetForm = ({ errors, touched, isSubmitting, isValid }) => (
  <Form>
    <fieldset disabled={isSubmitting} aria-busy={isSubmitting}>
      {errors.apiError && <ErrorMessage error={errors.apiError} />}

      <div>
        {touched.password && errors.password && <p>{errors.password}</p>}
        <Field type="password" name="password" placeholder="New Password" />
      </div>
      <div>
        {touched.confirmPassword && errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <Field
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
        />
      </div>
      <button type="submit" disabled={isSubmitting || !isValid}>
        Change my password
      </button>
    </fieldset>
  </Form>
);

const passwordRequired = 'Password is required';
const confirmPasswordRequired = 'Password confirmation is required';
const confirmPasswordMismatch = 'Passwords must match';
const passwordNotLongEnough = 'Password must be at least 9 characters';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(9, passwordNotLongEnough)
    .max(255)
    .required(passwordRequired),
  confirmPassword: Yup.string()
    .required(confirmPasswordRequired)
    .oneOf([Yup.ref('password')], confirmPasswordMismatch),
});

export default withFormik({
  mapPropsToValues({ password, confirmPassword }) {
    return {
      password: password || '',
      confirmPassword: confirmPassword || '',
    };
  },
  validationSchema,
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
