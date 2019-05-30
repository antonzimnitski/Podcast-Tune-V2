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

const OTHER_SEARCH_RESULTS_QUERY = gql`
  query OTHER_SEARCH_RESULTS_QUERY($searchTerm: String!, $limit: Int) {
    itunesResults(searchTerm: $searchTerm, limit: $limit) {
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
    topResults: [],
    otherResults: [],
  };

  onChange = (e, client) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    this.getResults(searchTerm, client);
  };

  getResults = debounce(async (searchTerm, client) => {
    this.setState({ isLoading: true });

    const res = await client.query({
      query: SEARCH_PODCASTS_QUERY,
      variables: { searchTerm },
    });

    this.setState({ isLoading: false, topResults: res.data.podcasts });

    await this.getOtherResults(searchTerm, client);
  }, 500);

  getOtherResults = async (searchTerm, client) => {
    const { topResults } = this.state;

    const res = await client.query({
      query: OTHER_SEARCH_RESULTS_QUERY,
      variables: { searchTerm },
    });

    const { itunesResults } = res.data;
    const otherResults = itunesResults.filter(
      podcast => !topResults.some(el => el.itunesId === podcast.itunesId)
    );

    this.setState({ otherResults });
  };

  render() {
    const { isLoading, topResults, otherResults } = this.state;

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
            {!topResults.length && !isLoading && (
              <p className="search__empty-message">Nothing Found.</p>
            )}

            {topResults.map(podcast => {
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

        {!!otherResults.length && (
          <div className="search__other-results">
            <h2 className="search__sub-title">Other Results</h2>
            <div className="search__result-list">
              {otherResults.map(podcast => {
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
        )}
      </div>
    );
  }
}

export default SearchPage;
