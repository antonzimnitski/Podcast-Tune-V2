import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import CategoryItem from './CategoryItem';

const CATEGORIES_CONNECTION_QUERY = gql`
  query CATEGORIES_CONNECTION_QUERY($after: String) {
    categoriesConnection(first: 15, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }

      edges {
        node {
          id
          name
          itunesId
        }
      }
    }
  }
`;

class Categories extends Component {
  state = {
    isLoading: false,
  };

  render() {
    return (
      <div className="categories container">
        <h3 className="categories__sub-title">All Categories</h3>
        <Query query={CATEGORIES_CONNECTION_QUERY}>
          {({ data, error, loading, fetchMore }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            const { isLoading } = this.state;
            const { categoriesConnection } = data;
            const { edges, pageInfo } = categoriesConnection;
            const { hasNextPage, endCursor } = pageInfo;

            return (
              <>
                <div className="categories__list">
                  {edges &&
                    edges.map(({ node }) => (
                      <CategoryItem key={node.id} category={node} />
                    ))}
                </div>
                {hasNextPage ? (
                  <button
                    type="button"
                    aria-disabled={isLoading}
                    disabled={isLoading}
                    className="btn btn--large"
                    onClick={() => {
                      this.setState({ isLoading: true });
                      fetchMore({
                        variables: { after: endCursor },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                          this.setState({ isLoading: false });
                          if (!fetchMoreResult) return previousResult;

                          return {
                            categoriesConnection: {
                              __typename: 'CategoriesConnection',
                              pageInfo:
                                fetchMoreResult.categoriesConnection.pageInfo,
                              edges: [
                                ...previousResult.categoriesConnection.edges,
                                ...fetchMoreResult.categoriesConnection.edges,
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
  }
}

export default Categories;
