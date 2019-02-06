import React from 'react';
import PropTypes from 'prop-types';

export class CategoryList extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
    deleteCategory: PropTypes.func.isRequired,
  };

  handleDelete = (uid) => () => {
    if (!confirm('Do you really want to delete this category?')) {
      return;
    }
    this.props.deleteCategory(uid);
  };

  render() {
    return (
      <ol>
        {this.props.categories.map(({ title, uid }) => (
          <li key={uid}>
            {title}
            <button onClick={this.handleDelete(uid)}>&times;</button>
          </li>
        ))}
      </ol>
    );
  }
}
