import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const LOG_OUT_MUTATION = gql`
  mutation LOG_OUT_MUTATION {
    logout {
      message
    }
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
          <button
            type="button"
            className="nav__group-button"
            onClick={() => {
              logout();
              client.resetStore();
            }}
          >
            Log Out
          </button>
        )}
      </Mutation>
    )}
  </ApolloConsumer>
);
export default Logout;
