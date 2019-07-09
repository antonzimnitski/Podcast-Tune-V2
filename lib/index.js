const resolvers = {
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
    play(_, __, ctx) {
      const data = {
        data: { isPlaying: true },
      };

      ctx.cache.writeData(data);
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
      const data = {
        time: {
          __typename: 'Time',
          current,
          max,
        },
      };
      cache.writeData({ data });
      return data;
    },
    changePlaybackRate(_, { playbackRate }, { cache }) {
      if (!playbackRate || playbackRate < 0.5 || playbackRate > 4) return;

      const data = {
        playbackRate,
      };

      cache.writeData({ data });
      return data;
    },
    changeVolume(_, { volume }, { cache }) {
      if (!volume || volume < 0 || volume > 1) return;

      const data = {
        volume,
        isMuted: false,
      };

      cache.writeData({ data });
      return data;
    },
    mute(_, __, { cache }) {
      const data = {
        isMuted: true,
      };

      cache.writeData({ data });
      return data;
    },
    unmute(_, __, { cache }) {
      const data = {
        isMuted: false,
      };

      cache.writeData({ data });
      return data;
    },
  },
};

const defaults = {
  modalType: null,
  playlist: [],
  isPlaying: false,
  playingEpisodeId: null,
  isPlayerOpen: false,
  playbackRate: 1,
  volume: 0.5,
  isMuted: false,
  time: {
    __typename: 'Time',
    current: null,
    max: null,
  },
};

export { resolvers };
export { defaults };

export default { resolvers, defaults };
