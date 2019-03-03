import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import { QUERY_GET_FORM_ERRORS } from '../../apollo';

export const ErrorFeedback = ({ type }) => (
  <Query query={QUERY_GET_FORM_ERRORS} variables={{ type }}>
    {({ data: { getFormErrors: errors } = {} }) => {
      if (!errors || !errors.length) {
        return null;
      }

      const color = { color: 'crimson' };

      if (errors.length === 1) {
        return <p style={color}>{errors[0].message}</p>;
      }

      return (
        <ul>
          {errors.map(({ message }) => (
            <li key={encodeURIComponent(message)} style={color}>
              {message}
            </li>
          ))}
        </ul>
      );
    }}
  </Query>
);

ErrorFeedback.propTypes = {
  type: PropTypes.oneOf(['Category', 'Post', 'Media']),
};
