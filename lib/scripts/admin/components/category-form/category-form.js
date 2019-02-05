import React from 'react';

import { ReducerContext } from '../../reduxxx';
import { addCategory } from '../../state';
import { Form } from '../form/form';

export class CategoryForm extends React.Component {
  static contextType = ReducerContext;

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
      await this.context.dispatch(addCategory(this.state.value));
      this.setState({ value: '', disabled: false });
    } catch (err) {
      this.setState({ disabled: false });
    }
  };

  render() {
    const { value, disabled } = this.state;
    const formProps = {
      method: 'post',
      action: '',
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
