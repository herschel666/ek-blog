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
    const [blob] = form.elements.image.files;

    if (blob.size > MAX_SIZE) {
      alert('Datei zu groß.');
      return;
    }

    const image = await readFile(blob);
    const payload = new URLSearchParams({
      description: form.elements.description.value.trim(),
      image,
    });
    await this.props.addMedia(form.action, payload.toString());

    form.reset();
  };

  render() {
    const formProps = {
      method: 'post',
      action: this.props.apiUrl,
      onSubmit: this.handleSubmit,
      legend: 'Upload an image',
      submitLabel: 'Upload',
    };

    return (
      <Form {...formProps}>
        <input
          type="file"
          name="image"
          accept="image/jpg,image/png,image/gif"
        />
        <br />
        <input type="text" name="description" placeholder="Description…" />
        <br />
      </Form>
    );
  }
}
