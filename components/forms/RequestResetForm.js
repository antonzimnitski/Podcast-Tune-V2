import React from 'react';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import ErrorMessage from '../ErrorMessage';

const RequestResetForm = ({ errors, touched, isSubmitting }) => (
  <Form>
    <fieldset disabled={isSubmitting} aria-busy={isSubmitting}>
      {errors.apiError && <ErrorMessage error={errors.apiError} />}

      <div>
        {touched.email && errors.email && <p>{errors.email}</p>}
        <Field type="email" name="email" placeholder="Email" />
      </div>
      <button type="submit" disabled={isSubmitting}>
        Reset my password
      </button>
    </fieldset>
  </Form>
);

const emailRequired = 'Email is required';
const invalidEmail = "Email isn't valid";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .min(3)
    .max(255)
    .email(invalidEmail)
    .required(emailRequired),
});

export default withFormik({
  mapPropsToValues({ email, password }) {
    return {
      email: email || '',
      password: password || '',
    };
  },
  validationSchema,
  handleSubmit: async (values, { props, setSubmitting }) => {
    try {
      await props.requestReset({
        variables: {
          ...values,
        },
      });
    } catch (error) {
      setSubmitting(false);
    }
  },
})(RequestResetForm);
