import React from 'react';
import PropTypes from 'prop-types';

import { MediaForm } from '../media-form/media-form';
import { MediaLibraryItem } from '../media-library-item/media-library-item';

export class MediaLibrary extends React.Component {
  static propTypes = {
    mediaElements: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        filePath: PropTypes.string.isRequired,
      })
    ).isRequired,
    mediaFormErrors: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string.isRequired,
      })
    ).isRequired,
    loadMediaElements: PropTypes.func.isRequired,
    createMediaElement: PropTypes.func.isRequired,
    invalidateMediaForm: PropTypes.func.isRequired,
    deleteMediaElement: PropTypes.func.isRequired,
    setMediaElementsCurrentPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    nextPage: PropTypes.number,
    addToEditor: PropTypes.func,
  };
  static defaultProps = {
    addToEditor: () => () => void 0,
  };

  state = {
    sizes: [],
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

  setSizeValue = (index) => (evnt) =>
    this.setState((state) => {
      const sizes = state.sizes.slice();
      sizes[index] = evnt.target.value;

      return {
        sizes,
      };
    });

  setPrevPage = () =>
    this.props.setMediaElementsCurrentPage(this.props.currentPage - 1);

  setNextPage = () =>
    this.props.setMediaElementsCurrentPage(this.props.nextPage);

  render() {
    const {
      mediaElements,
      mediaFormErrors,
      currentPage,
      nextPage,
    } = this.props;

    return (
      <>
        <MediaForm
          createMediaElement={this.props.createMediaElement}
          invalidateMediaForm={this.props.invalidateMediaForm}
          mediaFormErrors={mediaFormErrors}
        />
        <ul>
          {mediaElements.map((props) => (
            <MediaLibraryItem
              key={props.uid}
              {...props}
              handleDelete={this.handleDelete}
              addToEditor={this.props.addToEditor}
            />
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
