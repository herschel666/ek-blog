import React from 'react';
import PropTypes from 'prop-types';

export class CategoryList extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    apiUrl: PropTypes.string.isRequired,
    deleteCategory: PropTypes.func.isRequired,
  };

  handleDeleteSubmit = async (evnt) => {
    evnt.preventDefault();

    await this.props.deleteCategory(evnt.target.action);
  };

  render() {
    return (
      <ol>
        {this.props.categories.map(({ title, uid }) => (
          <li key={uid}>
            {title}
            <form
              action={`${this.props.apiUrl}/${uid}`}
              method="delete"
              onSubmit={this.handleDeleteSubmit}
              style={{ display: 'inline' }}
            >
              <button>&times;</button>
            </form>
          </li>
        ))}
      </ol>
    );
  }
}
