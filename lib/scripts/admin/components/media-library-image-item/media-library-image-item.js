import React from 'react';
import PropTypes from 'prop-types';

export class MediaLibraryImageItem extends React.Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    description: PropTypes.string,
    root: PropTypes.string.isRequired,
    filehash: PropTypes.string.isRequired,
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
    const { uid, root, filehash, ext, description, addToEditor } = this.props;
    const isProcessing = filehash === 'processing';

    return (
      <li>
        <figure>
          {isProcessing ? (
            <b>Processing…</b>
          ) : (
            <img src={`${root}${filehash}-thumb.${ext}`} alt="" width="80" />
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
                root,
                filehash,
                ext,
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
