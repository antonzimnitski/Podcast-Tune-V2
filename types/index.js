import { shape, string, number, node, arrayOf, bool } from 'prop-types';

export const categoryType = shape({
  id: string.isRequired,
  itunesId: number.isRequired,
  name: string.isRequired,
});

export const previewType = shape({
  id: string.isRequired,
  title: string.isRequired,
  description: string.isRequired,
  artworkLarge: string.isRequired,
});

export const searchItemType = shape({
  id: string.isRequired,
  itunesId: number.isRequired,
  title: string.isRequired,
  author: string.isRequired,
  artworkSmall: string.isRequired,
});

export const episodeType = shape({
  id: string.isRequired,
  title: string.isRequired,
  description: string,
  pubDate: string.isRequired,
  isInFavorites: bool.isRequired,
  isInQueue: bool.isRequired,
});

export const urlQueryType = shape({
  id: string,
});

export const childrenType = node;
export const childrenTypeDefault = null;

export const resultsType = arrayOf(searchItemType);
