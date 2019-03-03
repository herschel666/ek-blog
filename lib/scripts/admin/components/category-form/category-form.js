import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';

import { Form } from '../form/form';
import { ErrorFeedback } from '../error-feedback/error-feedback';
import { MUTATION_CREATE_CATEGORY, QUERY_GET_FORM_ERRORS } from '../../apollo';

export class CategoryFormComponent extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func.isRequired,
    }).isRequired,
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
      await this.props.client.mutate({
        mutation: MUTATION_CREATE_CATEGORY,
        variables: {
          category: {
            __typename: 'NewCategory',
            title: this.state.value,
          },
        },
        refetchQueries: [
          { query: QUERY_GET_FORM_ERRORS, variables: { type: 'Category' } },
        ],
      });
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
        <ErrorFeedback type="Category" />
        <Form {...formProps}>
          <input {...inputProps} />
        </Form>
      </>
    );
  }
}

export const CategoryForm = (props) => (
  <ApolloConsumer>
    {(client) => <CategoryFormComponent {...props} client={client} />}
  </ApolloConsumer>
);
