import React from 'react';

export class MediaLibrary extends React.Component {
  handleSubmit = (evnt) => {
    evnt.preventDefault();

    this.props.deleteImage(evnt.target.action);
  };

  render() {
    const { media, apiUrl, addPhoto } = this.props;

    return (
      <ul>
        {media.map(({ uid, description, filePath }) => (
          <li key={uid}>
            <figure>
              <img src={filePath} alt="" width="80" />
              {description && <figcaption>{description}</figcaption>}
            </figure>
            <form
              method="delete"
              action={`${apiUrl}/${uid}`}
              onSubmit={this.handleSubmit}
              style={{ display: 'inline' }}
            >
              <button>&times;</button>
              <button onClick={addPhoto(filePath, description)}>Add</button>
            </form>
          </li>
        ))}
      </ul>
    );
  }
}
