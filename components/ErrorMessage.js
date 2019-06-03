import React from 'react';
import { object } from 'prop-types';

const DisplayError = ({ error }) => {
  if (!error || !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <div className="error" key={i}>
        <p className="error__message" data-test="graphql-error">
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </div>
    ));
  }
  return (
    <div className="error">
      <p className="error__message" data-test="graphql-error">
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </div>
  );
};

DisplayError.defaultProps = {
  error: {},
};

DisplayError.propTypes = {
  error: object,
};

export default DisplayError;
