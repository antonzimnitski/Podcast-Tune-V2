import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Category from './Category';

const ALL_CATEGORIES_QUERY = gql`
  query ALL_CATEGORIES_QUERY {
    categories {
      id
      itunesId
      name
    }
  }
`;

class Categories extends Component {
  render() {
    return (
      <div className="categories">
        <h3 className="categories__sub-title">All Categories</h3>
        <Query query={ALL_CATEGORIES_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            const { categories } = data;

            return (
              <div>
                {categories &&
                  categories.map(category => (
                    <Category key={category.id} category={category} />
                  ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Categories;
