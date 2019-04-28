import React from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

import { MUTATION_DELETE_MEDIA, QUERY_GET_MEDIA_LIST } from '../../apollo';
import { MediaLibraryDocumentItem } from '../media-library-document-item/media-library-document-item';
import { MediaLibraryImageItem } from '../media-library-image-item/media-library-image-item';

export const MediaLibraryItem = ({ ext, uid, page, ...rest }) => (
  <Mutation
    mutation={MUTATION_DELETE_MEDIA}
    variables={{ media: { __typename: 'Media', uid } }}
    refetchQueries={[{ query: QUERY_GET_MEDIA_LIST, variables: { page } }]}
  >
    {(deleteMedia) => {
      const props = { ...rest, ext, uid, page };

      if (ext === 'pdf') {
        return (
          <MediaLibraryDocumentItem deleteMedia={deleteMedia} {...props} />
        );
      }
      return <MediaLibraryImageItem deleteMedia={deleteMedia} {...props} />;
    }}
  </Mutation>
);

MediaLibraryItem.propTypes = {
  page: PropTypes.number.isRequired,
  uid: PropTypes.string.isRequired,
  description: PropTypes.string,
  filehash: PropTypes.string.isRequired,
  ext: PropTypes.string.isRequired,
  addToEditor: PropTypes.func.isRequired,
};
