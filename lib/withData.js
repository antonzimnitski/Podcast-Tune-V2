import withApollo from 'next-with-apollo';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { endpoint, prodEndpoint } from '../config';
import { resolvers, defaults } from './index';

function createClient({ headers }) {
  const cache = new InMemoryCache();

  const client = new ApolloClient({
    cache,
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    resolvers,
  });

  cache.writeData({
    data: defaults,
  });

  client.onResetStore(() =>
    cache.writeData({
      data: defaults,
    })
  );

  return client;
}

export default withApollo(createClient);
