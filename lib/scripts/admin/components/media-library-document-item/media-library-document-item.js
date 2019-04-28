import React from 'react';
import PropTypes from 'prop-types';

export const MediaLibraryDocumentItem = (props) => {
  const { filehash, ext, description, deleteMedia, addToEditor } = props;

  return (
    <li>
      <figure>
        <b>pdf</b>
        {description && <figcaption>{description}</figcaption>}
      </figure>
      <button onClick={deleteMedia}>&times;</button>
      <button
        onClick={addToEditor({
          filehash,
          ext,
          description,
        })}
      >
        Add
      </button>
    </li>
  );
};

MediaLibraryDocumentItem.propTypes = {
  uid: PropTypes.string.isRequired,
  description: PropTypes.string,
  filehash: PropTypes.string.isRequired,
  ext: PropTypes.string.isRequired,
  deleteMedia: PropTypes.func.isRequired,
  addToEditor: PropTypes.func.isRequired,
};
