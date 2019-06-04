import PasswordReset from '../components/PasswordReset';
import { urlQueryType } from '../types';

const Reset = ({ query }) => <PasswordReset resetToken={query.resetToken} />;

export default Reset;

Reset.propTypes = {
  query: urlQueryType,
};
