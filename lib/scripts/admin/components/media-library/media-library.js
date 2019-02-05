import React from 'react';

import { ReducerContext } from '../../reduxxx';
import { deleteImage, loadMediaElements, addMediaElement } from '../../state';
import { MediaForm } from '../media-form/media-form';

export class MediaLibrary extends React.Component {
  static contextType = ReducerContext;

  componentDidMount() {
    this.context.dispatch(loadMediaElements());
  }

  addMediaElement = (description, image) =>
    this.context.dispatch(addMediaElement(description, image));

  handleDelete = (uid) => () => {
    if (!confirm('Do you really want to delete this image?')) {
      return;
    }
    this.context.dispatch(deleteImage(uid));
  };

  render() {
    const { mediaElements } = this.context.state.app;

    return (
      <>
        <MediaForm addMediaElement={this.addMediaElement} />
        <ul>
          {mediaElements.map(({ uid, description, filePath }) => (
            <li key={uid}>
              <figure>
                <img src={filePath} alt="" width="80" />
                {description && <figcaption>{description}</figcaption>}
              </figure>
              <button onSubmit={this.handleDelete(uid)}>&times;</button>
              <button onClick={this.props.addToEditor(filePath, description)}>
                Add
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
