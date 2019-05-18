import React, { Component } from 'react';
import Link from 'next/link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { categoryType } from '../types';

const TOP_PODCASTS_ARTWORKS = gql`
  query TOP_PODCASTS_ARTWORKS($category: Int) {
    podcasts(where: { categories_some: { itunesId: $category } }, first: 3) {
      title
      artworkSmall
    }
  }
`;

class CategoryItem extends Component {
  static propTypes = {
    category: categoryType.isRequired,
  };

  render() {
    const { category } = this.props;
    const { id, itunesId, name } = category;
    return (
      <Link
        href={{
          pathname: '/category',
          query: { id: itunesId },
        }}
      >
        <a className="category">
          <Query
            query={TOP_PODCASTS_ARTWORKS}
            variables={{ category: itunesId }}
          >
            {({ data, error, loading }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error: {error.message}</p>;

              const { podcasts } = data;

              return (
                <div className="category__collage">
                  {podcasts &&
                    podcasts.map(({ title, artworkSmall }, index) => (
                      <img
                        className={`category__image category__image--${index +
                          1}`}
                        key={`${title}-${id}`}
                        src={artworkSmall}
                        alt={`${title} artwork.`}
                      />
                    ))}
                </div>
              );
            }}
          </Query>
          <h3 className="category__name">{name}</h3>
        </a>
      </Link>
    );
  }
}

export default CategoryItem;
