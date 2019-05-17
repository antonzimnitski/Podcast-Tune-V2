import { shape, string, number } from 'prop-types';

export const categoryType = shape({
  id: string.isRequired,
  itunesId: number.isRequired,
  name: string.isRequired,
});
