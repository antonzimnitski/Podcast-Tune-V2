import React, { useState } from 'react';
import { string } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { urlQueryType } from '../types';
import PodcastPreview from '../components/PodcastPreview';

const PODCASTS_CONNECTION_QUERY = gql`
  query PODCASTS_CONNECTION_QUERY($itunesId: Int!, $after: String) {
    podcastsConnection(
      where: { categories_some: { itunesId: $itunesId } }
      first: 25
      after: $after
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }

      edges {
        node {
          id
          title
          description
          artworkLarge
        }
      }
    }
  }
`;

const Category = ({ query: { id } }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <div className="previews container">
      <h3 className="previews__sub-title">Top Rated Podcasts</h3>

      <Query
        query={PODCASTS_CONNECTION_QUERY}
        variables={{
          itunesId: +id,
        }}
      >
        {({ data, error, loading, fetchMore }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;

          const { podcastsConnection } = data;

          if (!podcastsConnection)
            return <p>No Podcasts Found for Category '{id}'</p>;

          const { edges, pageInfo } = podcastsConnection;
          const { hasNextPage, endCursor } = pageInfo;

          return (
            <>
              <div className="previews__list">
                {edges &&
                  edges.map(({ node }) => (
                    <PodcastPreview key={node.id} preview={node} />
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
                          podcastsConnection: {
                            __typename: 'PodcastConnection',
                            pageInfo:
                              fetchMoreResult.podcastsConnection.pageInfo,
                            edges: [
                              ...previousResult.podcastsConnection.edges,
                              ...fetchMoreResult.podcastsConnection.edges,
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

export default Category;

Category.propTypes = {
  query: urlQueryType,
  id: string.isRequired,
};
