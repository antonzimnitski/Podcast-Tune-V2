import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const PODCAST_DESCRIPTION_QUERY = gql`
  query PODCAST_DESCRIPTION_QUERY($id: ID!) {
    podcast(where: { id: $id }) {
      id
      description
    }
  }
`;

const PODCAST_RECENT_EPISODES_QUERY = gql`
  query PODCAST_RECENT_EPISODES_QUERY($id: ID!) {
    podcast(where: { id: $id }) {
      id
      title

      episodes(first: 3, orderBy: pubDate_DESC) {
        title
        description
        pubDate
      }
    }
  }
`;

const AboutTab = ({ id }) => (
  <div className="podcast__about-tab">
    <Query
      query={PODCAST_DESCRIPTION_QUERY}
      variables={{
        id,
      }}
    >
      {({ data, error, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error.message}</p>;

        const { podcast } = data;
        const { description } = podcast;

        if (!description) return null;

        return <div className="podcast__description">{description}</div>;
      }}
    </Query>

    <div className="podcast__recent-episodes">
      <h2 className="podcast__sub-title">Recent Episodes</h2>

      {process.browser && (
        <Query
          query={PODCAST_RECENT_EPISODES_QUERY}
          variables={{
            id,
          }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            const { podcast } = data;
            const { title } = podcast;
            const { episodes } = podcast;

            if (episodes && episodes.length === 0) {
              return (
                <p>
                  There are no episodes of "{title}" to display at the moment.
                </p>
              );
            }

            return (
              <div className="podcast__description">{episodes.length}</div>
            );
          }}
        </Query>
      )}
    </div>
  </div>
);

export default AboutTab;
