import React from 'react';
import PropTypes from 'prop-types';

export class MediaLibraryImageItem extends React.Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    description: PropTypes.string,
    filehash: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    ext: PropTypes.string.isRequired,
    deleteMedia: PropTypes.func.isRequired,
    addToEditor: PropTypes.func.isRequired,
  };

  state = {
    size: 'thumb',
  };

  setSizeValue = (evnt) =>
    this.setState({
      size: evnt.currentTarget.value,
    });

  render() {
    const sizes = ['thumb', 'small', 'medium', 'large'];
    const {
      uid,
      filehash,
      ext,
      width,
      height,
      description,
      addToEditor,
    } = this.props;
    const isProcessing = filehash === 'processing';
    const basePath = `${window.__blog__.paths.static}/media/`;

    return (
      <li>
        <figure>
          {isProcessing ? (
            <b>Processing…</b>
          ) : (
            <img
              src={`${basePath}${filehash}-thumb.${ext}`}
              alt=""
              width="80"
            />
          )}
          {description && <figcaption>{description}</figcaption>}
        </figure>
        {!isProcessing && (
          <>
            <button onClick={this.props.deleteMedia}>&times;</button>
            <label>
              Size:
              {sizes.map((size) => (
                <label key={size}>
                  <input
                    type="radio"
                    name={`image-size-${uid}`}
                    value={size}
                    onChange={this.setSizeValue}
                    checked={this.state.size === size}
                  />
                  {size}
                </label>
              ))}
            </label>
            <button
              onClick={addToEditor({
                filehash,
                ext,
                width,
                height,
                description,
                size: this.state.size,
              })}
            >
              Add
            </button>
          </>
        )}
      </li>
    );
  }
}
