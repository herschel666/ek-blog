import React from 'react';
import PropTypes from 'prop-types';

import { MediaLibraryDocumentItem } from '../media-library-document-item/media-library-document-item';
import { MediaLibraryImageItem } from '../media-library-image-item/media-library-image-item';

export const MediaLibraryItem = ({ ext, ...rest }) => {
  const props = { ...rest, ext };

  if (ext === 'pdf') {
    return <MediaLibraryDocumentItem {...props} />;
  }
  return <MediaLibraryImageItem {...props} />;
};

MediaLibraryItem.propTypes = {
  uid: PropTypes.string.isRequired,
  description: PropTypes.string,
  root: PropTypes.string.isRequired,
  filehash: PropTypes.string.isRequired,
  ext: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  addToEditor: PropTypes.func.isRequired,
};
