import React from 'react';

import { ReducerContext } from '../../reduxxx';
import { deleteCategory } from '../../state';

export class CategoryList extends React.Component {
  static contextType = ReducerContext;

  handleDelete = (uid) => () => {
    if (!confirm('Do you really want to delete this category?')) {
      return;
    }
    this.context.dispatch(deleteCategory(uid));
  };

  render() {
    return (
      <ol>
        {this.context.state.app.categories.map(({ title, uid }) => (
          <li key={uid}>
            {title}
            <button onClick={this.handleDelete(uid)}>&times;</button>
          </li>
        ))}
      </ol>
    );
  }
}
