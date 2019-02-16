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
    createMediaElement: PropTypes.func.isRequired,
    deleteMediaElement: PropTypes.func.isRequired,
    setMediaElementsCurrentPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    nextPage: PropTypes.number,
    addToEditor: PropTypes.func,
  };
  static defaultProps = {
    addToEditor: () => () => void 0,
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

  setPrevPage = () =>
    this.props.setMediaElementsCurrentPage(this.props.currentPage - 1);

  setNextPage = () =>
    this.props.setMediaElementsCurrentPage(this.props.nextPage);

  render() {
    const { mediaElements, currentPage, nextPage } = this.props;

    // TODO: tidy up this mess!!1
    return (
      <>
        <MediaForm createMediaElement={this.props.createMediaElement} />
        <ul>
          {mediaElements.map(({ uid, description, root, filehash, ext }) => (
            <li key={uid}>
              <figure>
                {ext === 'pdf' ? (
                  <b>pdf</b>
                ) : filehash === 'processing' ? (
                  <b>Processing…</b>
                ) : (
                  <img
                    src={`${root}${filehash}-thumb.${ext}`}
                    alt=""
                    width="80"
                  />
                )}
                {description && <figcaption>{description}</figcaption>}
              </figure>
              {filehash !== 'processing' && (
                <>
                  <button onClick={this.handleDelete(uid)}>&times;</button>
                  <button
                    onClick={this.props.addToEditor({
                      root,
                      filehash,
                      ext,
                      description,
                    })}
                  >
                    Add
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        {currentPage > 1 && (
          <button onClick={this.setPrevPage}>Prev page</button>
        )}
        {nextPage && <button onClick={this.setNextPage}>Next page</button>}
      </>
    );
  }
}
