import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    clientState: {
      resolvers: {
        Mutation: {
          openModal(_, variables, { cache }) {
            const { modalType } = variables;

            const data = {
              data: { modalType },
            };

            cache.writeData(data);
            return data;
          },
          closeModal(_, __, { cache }) {
            const data = {
              data: { modalType: null },
            };

            cache.writeData(data);
            return data;
          },
        },
      },
      defaults: {
        modalType: null,
      },
    },
  });
}

export default withApollo(createClient);
