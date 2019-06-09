import { Mutation } from 'react-apollo';
import { OPEN_MODAL_MUTATION, REGISTER } from '../modals';

const Register = () => (
  <Mutation mutation={OPEN_MODAL_MUTATION} variables={{ modalType: REGISTER }}>
    {openModal => (
      <button
        className="nav__group-button"
        type="button"
        onClick={() => openModal()}
      >
        Register
      </button>
    )}
  </Mutation>
);

export default Register;
