import React from 'react';
import PropTypes from 'prop-types';

export const ErrorFeedback = ({ errors }) => {
  if (!errors.length) {
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
};

ErrorFeedback.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
};
