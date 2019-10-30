import { Mutation } from 'react-apollo';
import { OPEN_MODAL_MUTATION, REGISTER } from '../modals';

import { GroupBtn } from './styles';

const Register = () => (
  <Mutation mutation={OPEN_MODAL_MUTATION} variables={{ modalType: REGISTER }}>
    {openModal => (
      <GroupBtn type="button" onClick={() => openModal()}>
        Register
      </GroupBtn>
    )}
  </Mutation>
);

export default Register;
