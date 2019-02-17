import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '../form/form';
import { ErrorFeedback } from '../error-feedback/error-feedback';

export class CategoryForm extends React.Component {
  static propTypes = {
    categoryFormErrors: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string.isRequired,
      })
    ).isRequired,
    addCategory: PropTypes.func.isRequired,
  };

  state = {
    disabled: false,
    value: '',
  };

  handleChange = (evnt) => {
    this.setState({
      value: evnt.target.value,
    });
  };

  handlePostSubmit = async (evnt) => {
    evnt.preventDefault();
    this.setState({ disabled: true });

    try {
      await this.props.addCategory(this.state.value);
      this.setState({ value: '', disabled: false });
    } catch (err) {
      this.setState({ disabled: false });
    }
  };

  render() {
    const { categoryFormErrors } = this.props;
    const { value, disabled } = this.state;
    const formProps = {
      method: 'post',
      action: '',
      onSubmit: this.handlePostSubmit,
      legend: 'Create a category',
      submitLabel: 'Create',
    };
    const inputProps = {
      type: 'text',
      placeholder: 'Category',
      onChange: this.handleChange,
      disabled,
      value,
    };

    return (
      <>
        <ErrorFeedback errors={categoryFormErrors} />
        <Form {...formProps}>
          <input {...inputProps} />
        </Form>
      </>
    );
  }
}
