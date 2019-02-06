import React from 'react';
import PropTypes from 'prop-types';

import { MediaForm } from '../media-form/media-form';

export class MediaLibrary extends React.Component {
  static propTypes = {
    mediaElements: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        filePath: PropTypes.string.isRequired,
      })
    ).isRequired,
    loadMediaElements: PropTypes.func.isRequired,
    addMediaElement: PropTypes.func.isRequired,
    deleteMediaElement: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.loadMediaElements();
  }

  handleDelete = (uid) => () => {
    if (!confirm('Do you really want to delete this image?')) {
      return;
    }
    this.props.deleteMediaElement(uid);
  };

  render() {
    const { mediaElements } = this.props;

    return (
      <>
        <MediaForm addMediaElement={this.props.addMediaElement} />
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
