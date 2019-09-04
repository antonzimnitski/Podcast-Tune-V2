import React, { useState } from 'react';
import { string } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Episode from '../Episode';

const EPISODES_CONNECTION_QUERY = gql`
  query EPISODES_CONNECTION_QUERY($id: ID!, $after: String) {
    episodesConnection(
      where: { podcast: { id: $id } }
      first: 25
      after: $after
      orderBy: pubDate_DESC
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }

      edges {
        node {
          id
          title
          descriptionSanitized
          pubDate
          isInFavorites
          isInQueue
          episodeArtwork

          podcast {
            id
            artworkSmall
          }
        }
      }
    }
  }
`;

const FeedTab = ({ id }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <div className="podcast__feed-tab">
      <Query
        query={EPISODES_CONNECTION_QUERY}
        variables={{
          id,
        }}
      >
        {({ data, error, loading, fetchMore }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;

          const { episodesConnection } = data;
          const { edges, pageInfo } = episodesConnection;
          const { hasNextPage, endCursor } = pageInfo;

          if (edges && edges.length === 0) {
            return <p>There are no episodes to display at the moment.</p>;
          }

          return (
            <>
              <div className="categories__list">
                {edges.map(({ node }) => (
                  <Episode key={node.id} episode={node} />
                ))}
              </div>
              {hasNextPage ? (
                <button
                  type="button"
                  aria-disabled={isLoading}
                  disabled={isLoading}
                  className="btn btn--large"
                  onClick={() => {
                    setLoading(true);
                    fetchMore({
                      variables: { after: endCursor },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        setLoading(false);
                        if (!fetchMoreResult) return previousResult;

                        return {
                          episodesConnection: {
                            __typename: 'EpisodeConnection',
                            pageInfo:
                              fetchMoreResult.episodesConnection.pageInfo,
                            edges: [
                              ...previousResult.episodesConnection.edges,
                              ...fetchMoreResult.episodesConnection.edges,
                            ],
                          },
                        };
                      },
                    });
                  }}
                >
                  Load more...
                </button>
              ) : null}
            </>
          );
        }}
      </Query>
    </div>
  );
};

export default FeedTab;

FeedTab.propTypes = {
  id: string.isRequired,
};
