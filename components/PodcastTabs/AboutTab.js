import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import RecentEpisodes from './RecentEpisodes';

const PODCAST_DESCRIPTION_QUERY = gql`
  query PODCAST_DESCRIPTION_QUERY($id: ID!) {
    podcast(where: { id: $id }) {
      id
      description
    }
  }
`;

const AboutTab = ({ id }) => (
  <div className="podcast__about-tab">
    <Query
      query={PODCAST_DESCRIPTION_QUERY}
      ssr={false}
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

    <RecentEpisodes id={id} />
  </div>
);

export default AboutTab;
