import { Mutation } from 'react-apollo';
import { OPEN_MODAL_MUTATION, LOGIN } from '../modals';

import { GroupBtn } from './styles';

const Login = () => (
  <Mutation mutation={OPEN_MODAL_MUTATION} variables={{ modalType: LOGIN }}>
    {openModal => (
      <GroupBtn type="button" onClick={() => openModal()}>
        Log in
      </GroupBtn>
    )}
  </Mutation>
);

export default Login;
