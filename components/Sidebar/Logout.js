import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

import { GroupBtn } from './styles';

const LOG_OUT_MUTATION = gql`
  mutation LOG_OUT_MUTATION {
    logout
  }
`;

const Logout = () => (
  <ApolloConsumer>
    {client => (
      <Mutation
        mutation={LOG_OUT_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {logout => (
          <GroupBtn
            type="button"
            onClick={() => {
              logout();
              client.resetStore();
            }}
          >
            Log Out
          </GroupBtn>
        )}
      </Mutation>
    )}
  </ApolloConsumer>
);
export default Logout;
