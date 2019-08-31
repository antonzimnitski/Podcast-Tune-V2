import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import CategoryItem from '../components/CategoryItem';

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

const Categories = () => {
  const [isLoading, setLoadingStatus] = useState(false);

  const { data, error, loading, fetchMore } = useQuery(
    CATEGORIES_CONNECTION_QUERY
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { categoriesConnection } = data;
  const { edges, pageInfo } = categoriesConnection;
  const { hasNextPage, endCursor } = pageInfo;

  return (
    <div className="categories container">
      <h3 className="categories__sub-title">All Categories</h3>
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
            setLoadingStatus(true);
            fetchMore({
              variables: { after: endCursor },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                setLoadingStatus(false);
                if (!fetchMoreResult) return previousResult;

                return {
                  categoriesConnection: {
                    __typename: 'CategoriesConnection',
                    pageInfo: fetchMoreResult.categoriesConnection.pageInfo,
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
    </div>
  );
};

export default Categories;
