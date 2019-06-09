import { Mutation } from 'react-apollo';
import { OPEN_MODAL_MUTATION, LOGIN } from '../modals';

const Login = () => (
  <Mutation mutation={OPEN_MODAL_MUTATION} variables={{ modalType: LOGIN }}>
    {openModal => (
      <button
        className="nav__group-button"
        type="button"
        onClick={() => openModal()}
      >
        Log in
      </button>
    )}
  </Mutation>
);

export default Login;
