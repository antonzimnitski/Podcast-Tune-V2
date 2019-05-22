import React, { Component } from 'react';
import { string } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Feed from './Feed';

const PODCAST_QUERY = gql`
  query PODCAST_QUERY($id: ID!) {
    podcast(where: { id: $id }) {
      id
      itunesId
      title
      author
      description
      artworkLarge
      websiteUrl
      feedUrl
    }
  }
`;

const EPISODES_QUERY = gql`
  query EPISODES_QUERY($podcastId: ID!) {
    episodesConnection(
      where: { AND: [{ podcast: { id: $podcastId } }, { pubDate_not: null }] }
      orderBy: pubDate_DESC
      first: 100
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }

      edges {
        node {
          id
          title
          duration
          pubDate
        }
      }
    }
  }
`;

class PodcastPage extends Component {
  static propTypes = {
    id: string.isRequired,
  };

  render() {
    const { id } = this.props;
    console.log({ id });

    return (
      <div className="previews">
        <h3 className="previews__sub-title">Podcast Page</h3>
        <Query
          query={PODCAST_QUERY}
          variables={{
            id,
          }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            const { podcast } = data;

            const {
              itunesId,
              title,
              author,
              description,
              artworkLarge,
              websiteUrl,
              feedUrl,
            } = podcast;

            return (
              <div>
                <div>{itunesId}</div>
                <div>{title}</div>
                <div>{author}</div>
                <div>{description}</div>
                <div>{artworkLarge}</div>
                <div>{websiteUrl}</div>
                <div>{feedUrl}</div>
              </div>
            );
          }}
        </Query>

        <Query
          query={EPISODES_QUERY}
          variables={{
            podcastId: id,
          }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            const { episodesConnection } = data;

            const { edges, pageInfo } = episodesConnection;
            const { hasNextPage, endCursor } = pageInfo;

            return (
              <>
                <Feed feed={edges} />
              </>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default PodcastPage;
