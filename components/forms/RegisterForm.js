import React from 'react';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import ErrorMessage from '../ErrorMessage';

const RegisterForm = ({ errors, touched, isSubmitting }) => (
  <Form>
    <fieldset disabled={isSubmitting} aria-busy={isSubmitting}>
      {errors.apiError && <ErrorMessage error={errors.apiError} />}

      <div>
        {touched.email && errors.email && <p>{errors.email}</p>}
        <Field type="email" name="email" placeholder="Email" />
      </div>
      <div>
        <Field type="name" name="name" placeholder="Your Name" />
      </div>
      <div>
        {touched.password && errors.password && <p>{errors.password}</p>}
        <Field type="password" name="password" placeholder="Password" />
      </div>
      <button type="submit" disabled={isSubmitting}>
        Create an Account
      </button>
    </fieldset>
  </Form>
);

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
