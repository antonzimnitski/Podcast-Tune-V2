import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import dayjs from 'dayjs';

import Episode from '../Episode';

const PODCAST_RECENT_EPISODES_QUERY = gql`
  query PODCAST_RECENT_EPISODES_QUERY($id: ID!) {
    podcast(where: { id: $id }) {
      id
      title
      feedCheckedAt

      episodes(first: 3, orderBy: pubDate_DESC) {
        id
        title
        description
        pubDate

        podcast {
          id
          artworkSmall
        }
      }
    }
  }
`;

const UPDATE_PODCAST_FEED_MUTATION = gql`
  mutation UPDATE_PODCAST_FEED_MUTATION($id: ID!) {
    updatePodcastFeed(id: $id) {
      id
      title
      pubDate
      description

      podcast {
        artworkSmall
      }
    }
  }
`;

class RecentEpisodes extends Component {
  state = {
    checkedForUpdates: false,
  };

  async updatePodcastFeed() {
    const { id, updatePodcastFeed } = this.props;

    this.setState({ checkedForUpdates: true });
    console.log('updating');
    try {
      await updatePodcastFeed({
        variables: { id },
        refetchQueries: [
          { query: PODCAST_RECENT_EPISODES_QUERY, variables: { id } },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { id } = this.props;

    return (
      <div className="podcast__recent-episodes">
        <h2 className="podcast__sub-title">Recent Episodes</h2>

        <Query
          query={PODCAST_RECENT_EPISODES_QUERY}
          ssr={false}
          variables={{
            id,
          }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            const { checkedForUpdates } = this.state;

            const { podcast } = data;
            const { title, feedCheckedAt } = podcast;

            if (
              !checkedForUpdates &&
              (feedCheckedAt === null ||
                dayjs(new Date()).diff(dayjs(feedCheckedAt), 'hour') > 2)
            ) {
              this.updatePodcastFeed();
            }

            const { episodes } = podcast;

            if (episodes && episodes.length === 0) {
              return (
                <p>
                  There are no episodes of "{title}" to display at the moment.
                </p>
              );
            }

            return episodes.map(episode => (
              <Episode key={episode.id} episode={episode} />
            ));
          }}
        </Query>
      </div>
    );
  }
}

export default graphql(UPDATE_PODCAST_FEED_MUTATION, {
  name: 'updatePodcastFeed',
})(RecentEpisodes);

RecentEpisodes.propTypes = {
  id: string.isRequired,
  updatePodcastFeed: func.isRequired,
};
