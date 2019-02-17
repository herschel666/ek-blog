import React from 'react';
import PropTypes from 'prop-types';

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

export class MediaForm extends React.Component {
  static propTypes = {
    mediaFormErrors: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string.isRequired,
      })
    ).isRequired,
    createMediaElement: PropTypes.func.isRequired,
    invalidateMediaForm: PropTypes.func.isRequired,
  };
  handleSubmit = async (evnt) => {
    evnt.preventDefault();

    const form = evnt.target;
    const [blob] = form.elements.media.files;

    if (!blob) {
      return this.props.invalidateMediaForm([
        {
          field: 'media',
          message: 'Please choose a file.',
        },
      ]);
    }

    if (blob.size > MAX_SIZE) {
      return this.props.invalidateMediaForm([
        {
          field: 'media',
          message: 'The given file exceeds the max size of 1 MB.',
        },
      ]);
    }

    const media = await readFile(blob);
    const description = form.elements.description.value.trim() || undefined;
    await this.props.createMediaElement(description, media);
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
        <ErrorFeedback errors={this.props.mediaFormErrors} />
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
