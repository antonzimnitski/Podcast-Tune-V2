import React, { Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import Link from 'next/link';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PodcastTabs from '../components/PodcastTabs';
import { CURRENT_USER_QUERY } from '../components/Sidebar/User';

function formatCategories(categories) {
  return (
    <>
      <span>A </span>
      {categories.map((el, index) => {
        const { id, name, itunesId } = el;
        const last = index === categories.length - 1;
        return (
          <Fragment key={id}>
            <Link
              href={{
                pathname: '/category',
                query: { id: itunesId },
              }}
            >
              <a className="podcast__category">{name}</a>
            </Link>
            <>{last ? '' : ', '}</>
          </Fragment>
        );
      })}

      <span> podcast.</span>
    </>
  );
}

const SUBSCRIBE_TO_PODCAST_MUTATION = gql`
  mutation SUBSCRIBE_TO_PODCAST_MUTATION($id: ID!) {
    subscribeToPodcast(id: $id) {
      id

      podcast {
        id
        isSubscribedTo
      }
    }
  }
`;

const UNSUBSCRIBE_FROM_PODCAST_MUTATION = gql`
  mutation UNSUBSCRIBE_FROM_PODCAST_MUTATION($id: ID!) {
    unsubscribeFromPodcast(id: $id) {
      id

      podcast {
        id
        isSubscribedTo
      }
    }
  }
`;

const PODCAST_QUERY = gql`
  query PODCAST_QUERY($id: ID!) {
    podcast(where: { id: $id }) {
      id
      itunesId
      title
      author
      artworkLarge
      websiteUrl
      feedUrl
      isSubscribedTo

      categories {
        id
        itunesId
        name
      }
    }
  }
`;

const Podcast = ({ query, subscribeToPodcast, unsubscribeFromPodcast }) => {
  const { id, url } = query;

  const { loading, error, data } = useQuery(PODCAST_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { podcast } = data;

  if (!podcast) {
    return <p>No Podcast with '{id}' was found.</p>;
  }

  const { title, author, artworkLarge, categories, isSubscribedTo } = podcast;

  return (
    <div className="podcast">
      <div className="podcast__header">
        <div className="podcast__banner">
          <div
            className="podcast__banner-image"
            style={{
              backgroundImage: `url("${artworkLarge}")`,
            }}
          />
        </div>
        <div className="podcast__card container">
          <div className="podcast__image-wrapper">
            <img
              src={artworkLarge}
              alt={`${title} podcast artwork.`}
              className="podcast__image"
            />
          </div>
          <div className="podcast__info">
            <div className="podcast__title-wrapper">
              <h1 className="podcast__title">{title}</h1>
              <div className="podcast__subscribe">
                <button
                  onClick={
                    isSubscribedTo ? unsubscribeFromPodcast : subscribeToPodcast
                  }
                  className={`podcast__subscribe-btn ${
                    isSubscribedTo ? 'podcast__subscribe-btn--subscribed' : ''
                  } `}
                  type="button"
                >
                  Subscribe
                </button>
              </div>
            </div>
            <p className="podcast__author">{author}</p>
            <p className="podcast__categories">
              {formatCategories(categories)}
            </p>
          </div>
        </div>
      </div>

      <PodcastTabs />
    </div>
  );
};

export default compose(
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(SUBSCRIBE_TO_PODCAST_MUTATION, {
    name: 'subscribeToPodcast',
    skip: props => !props.me,
    options: ({ query }) => ({
      variables: {
        id: query.id,
      },
    }),
  }),
  graphql(UNSUBSCRIBE_FROM_PODCAST_MUTATION, {
    name: 'unsubscribeFromPodcast',
    skip: props => !props.me,
    options: ({ query }) => ({
      variables: {
        id: query.id,
      },
    }),
  })
)(Podcast);
