import * as Yup from 'yup';

const emailRequired = 'Email is required';
const passwordRequired = 'Password is required';
const passwordNotLongEnough = 'Password must be at least 9 characters';
const invalidEmail = "Email isn't valid";
const confirmPasswordRequired = 'Password confirmation is required';
const confirmPasswordMismatch = 'Passwords must match';

export const emailRule = Yup.string()
  .min(3)
  .max(255)
  .email(invalidEmail)
  .required(emailRequired);

export const passwordRule = Yup.string()
  .min(9, passwordNotLongEnough)
  .max(255)
  .required(passwordRequired);

export const confirmPasswordRule = Yup.string()
  .required(confirmPasswordRequired)
  .oneOf([Yup.ref('password')], confirmPasswordMismatch);
