import { shape, string, number } from 'prop-types';

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

export const urlQueryType = shape({
  id: string,
});
