import React from 'react';

export class MediaList extends React.Component {
  handleSubmit = (evnt) => {
    evnt.preventDefault();

    this.props.deleteImage(evnt.target.action);
  };

  render() {
    const { media, apiUrl } = this.props;

    return (
      <ul>
        {media.map(({ uid, filename }) => (
          <li key={uid}>
            <img src={filename} alt="" width="80" />
            <form
              method="delete"
              action={`${apiUrl}/${uid}`}
              onSubmit={this.handleSubmit}
              style={{ display: 'inline' }}
            >
              <button>&times;</button>
            </form>
          </li>
        ))}
      </ul>
    );
  }
}
