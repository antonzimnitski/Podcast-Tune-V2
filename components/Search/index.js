import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';

import Icon from '@mdi/react';
import { mdiMagnify as searchIcon } from '@mdi/js';

import SearchResults from './SearchResults';

const SEARCH_PODCASTS_QUERY = gql`
  query SEARCH_PODCASTS_QUERY($searchTerm: String!) {
    podcasts(
      where: {
        OR: [
          { titleLC_contains: $searchTerm }
          { authorLC_contains: $searchTerm }
        ]
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
    touched: false,
    isLoading: false,
    topResults: [],
    otherResults: [],
  };

  onChange = (e, client) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    this.getResults(searchTerm, client);
  };

  getResults = debounce(async (searchTerm, client) => {
    this.setState({ isLoading: true, touched: true });

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
    const { isLoading, topResults, otherResults, touched } = this.state;

    return (
      <div className="search container">
        <h1 className="search__title">Search</h1>
        <ApolloConsumer>
          {client => (
            <div className="search__input-wrapper">
              <Icon path={searchIcon} className="search__input-icon" />
              <input
                className="search__input"
                type="search"
                onChange={e => {
                  e.persist();
                  this.onChange(e, client);
                }}
              />
            </div>
          )}
        </ApolloConsumer>

        {touched && (
          <>
            <SearchResults title="Top Results" results={topResults} />
            <SearchResults title="Other Results" results={otherResults} />
          </>
        )}
        {touched &&
          !isLoading &&
          !topResults.length &&
          !otherResults.length && (
            <p className="search__empty-message">Nothing Found.</p>
          )}
      </div>
    );
  }
}

export default SearchPage;
