import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';

import {
  QUERY_GET_MEDIA_LIST,
  QUERY_GET_FORM_ERRORS,
  MUTATION_CREATE_MEDIA,
  MUTATION_CREATE_FORM_ERROR,
} from '../../apollo';
import { Form } from '../form/form';
import { ErrorFeedback } from '../error-feedback/error-feedback';

const MAX_SIZE = 1000000; // ~1MB

const readFile = (blob) =>
  new Promise((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: (evnt) => resolve(btoa(evnt.target.result)),
      onerror: reject,
    });

    reader.readAsBinaryString(blob);
  });

export class MediaFormComponent extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func.isRequired,
    }).isRequired,
    page: PropTypes.number.isRequired,
  };

  propagateError = (field, message) => {
    this.props.client.mutate({
      mutation: MUTATION_CREATE_FORM_ERROR,
      variables: {
        error: {
          type: 'Media',
          __typename: 'FormError',
          field,
          message,
        },
      },
    });
  };

  handleSubmit = async (evnt) => {
    evnt.preventDefault();

    const form = evnt.target;
    const [blob] = form.elements.media.files;

    if (!blob) {
      return this.propagateError('media', 'Please choose a file.');
    }

    if (blob.size > MAX_SIZE) {
      return this.propagateError(
        'media',
        'The given file exceeds the max size of 1 MB.'
      );
    }

    const media = await readFile(blob);
    const description = form.elements.description.value.trim() || undefined;
    await this.props.client.mutate({
      mutation: MUTATION_CREATE_MEDIA,
      variables: {
        media: {
          media,
          description,
        },
      },
      refetchQueries: [
        {
          query: QUERY_GET_MEDIA_LIST,
          variables: { page: this.props.page },
        },
        { query: QUERY_GET_FORM_ERRORS, variables: { type: 'Media' } },
      ],
    });
    form.reset();
  };

  render() {
    const formProps = {
      method: 'post',
      action: '',
      onSubmit: this.handleSubmit,
      legend: 'Upload a media file',
      submitLabel: 'Upload',
    };

    return (
      <>
        <ErrorFeedback type="Media" />
        <Form {...formProps}>
          <input
            type="file"
            name="media"
            accept="image/jpg,image/png,image/gif,application/pdf"
          />
          <br />
          <input type="text" name="description" placeholder="Description…" />
          <br />
        </Form>
      </>
    );
  }
}

export const MediaForm = (props) => (
  <ApolloConsumer>
    {(client) => <MediaFormComponent {...props} client={client} />}
  </ApolloConsumer>
);
