import React from 'react';

import { Form } from '../form/form';

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
  handleSubmit = async (evnt) => {
    evnt.preventDefault();

    const form = evnt.target;
    const [blob] = form.elements.media.files;

    if (blob.size > MAX_SIZE) {
      alert('Datei zu groß.');
      return;
    }

    const media = await readFile(blob);
    const description = form.elements.description.value.trim();
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
    );
  }
}
