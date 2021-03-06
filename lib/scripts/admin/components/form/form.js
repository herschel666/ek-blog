import React from 'react';
import PropTypes from 'prop-types';

export const Form = (props) => (
  <form method={props.method} action={props.action} onSubmit={props.onSubmit}>
    <fieldset>
      {props.legend && <legend>{props.legend}</legend>}
      {props.children}
      <button disabled={props.disabled}>{props.submitLabel}</button>
    </fieldset>
  </form>
);

Form.propTypes = {
  method: PropTypes.oneOf(['get', 'post', 'put', 'delete']).isRequired,
  action: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  legend: PropTypes.string,
  submitLabel: PropTypes.string,
  disabled: PropTypes.bool,
};

Form.defaultProps = {
  submitLabel: 'Submit',
  disabled: false,
};
