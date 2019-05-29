import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';

const SEARCH_PODCASTS_QUERY = gql`
  query SEARCH_PODCASTS_QUERY($searchTerm: String!) {
    podcasts(
      where: {
        OR: [{ title_contains: $searchTerm }, { author_contains: $searchTerm }]
      }
      first: 20
    ) {
      id
      itunesId
      title
      author
      artworkSmall
    }
  }
`;

class SearchPage extends Component {
  state = {
    isLoading: false,
    podcasts: [],
  };

  onChange = debounce(async (e, client) => {
    this.setState({ isLoading: true });
    const res = await client.query({
      query: SEARCH_PODCASTS_QUERY,
      variables: { searchTerm: e.target.value },
    });

    this.setState({ isLoading: true, podcasts: res.data.podcasts });
  }, 500);

  render() {
    const { podcasts, isLoading } = this.state;

    return (
      <div className="search">
        <h1 className="search__title">Search</h1>
        <ApolloConsumer>
          {client => (
            <input
              type="search"
              onChange={e => {
                e.persist();
                this.onChange(e, client);
              }}
            />
          )}
        </ApolloConsumer>
        <div className="search__top-results">
          <h2 className="search__sub-title">Top Results</h2>
          <div className="search__result-list">
            {!podcasts.length && !isLoading && (
              <p className="search__empty-message">Nothing Found.</p>
            )}

            {podcasts.map(podcast => {
              const { id, title, author, artworkSmall } = podcast;
              return (
                <div key={id} className="search__item">
                  <img
                    src={artworkSmall}
                    alt={title}
                    className="search__item-image"
                  />
                  <div className="search__item-info">
                    <h3 className="search__item-title">{title}</h3>
                    <p className="search__item-author">{author}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchPage;
