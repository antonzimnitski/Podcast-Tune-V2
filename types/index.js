import { shape, string } from 'prop-types';

export const categoryType = shape({
  id: string.isRequired,
  itunesId: string.isRequired,
  name: string.isRequired,
});
