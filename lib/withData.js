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
          openModal(_, { modalType }, { cache }) {
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
          play(_, __, { cache }) {
            const data = {
              data: { isPlaying: true },
            };

            cache.writeData(data);
            return data;
          },
          pause(_, __, { cache }) {
            const data = {
              data: { isPlaying: false },
            };

            cache.writeData(data);
            return data;
          },
          setPlayingEpisode(_, { id }, { cache }) {
            const data = {
              data: { playingEpisodeId: id, isPlaying: true },
            };

            cache.writeData(data);
            return data;
          },
          openPlayer(_, __, { cache }) {
            const data = {
              data: { isPlayerOpen: true },
            };

            cache.writeData(data);
            return data;
          },
          updateTime(_, { current, max }, { cache }) {
            const timeData = {
              __typename: 'Time',
              current,
              max,
            };
            cache.writeData({ timeData });
            return timeData;
          },
        },
      },
      defaults: {
        modalType: null,
        playlist: [],
        isPlaying: false,
        playingEpisodeId: null,
        isPlayerOpen: false,
        time: {
          __typename: 'Time',
          current: null,
          max: null,
        },
      },
    },
  });
}

export default withApollo(createClient);
