import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '../form/form';

export class CategoryForm extends React.Component {
  static propTypes = {
    apiUrl: PropTypes.string.isRequired,
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
      console.error(err);
      this.setState({ disabled: false });
    }
  };

  render() {
    const { value, disabled } = this.state;
    const formProps = {
      method: 'post',
      action: this.props.apiUrl,
      onSubmit: this.handlePostSubmit,
      legend: 'Create a category',
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
        <Form {...formProps}>
          <input {...inputProps} />
        </Form>
      </>
    );
  }
}
