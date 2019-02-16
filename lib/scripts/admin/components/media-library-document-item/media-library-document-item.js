import React from 'react';
import PropTypes from 'prop-types';

export const MediaLibraryDocumentItem = (props) => {
  const {
    uid,
    root,
    filehash,
    ext,
    description,
    handleDelete,
    addToEditor,
  } = props;

  return (
    <li>
      <figure>
        <b>pdf</b>
        {description && <figcaption>{description}</figcaption>}
      </figure>
      <button onClick={handleDelete(uid)}>&times;</button>
      <button
        onClick={addToEditor({
          root,
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
  root: PropTypes.string.isRequired,
  filehash: PropTypes.string.isRequired,
  ext: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  addToEditor: PropTypes.func.isRequired,
};
