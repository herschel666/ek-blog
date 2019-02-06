import React from 'react';

import { ReducerContext } from '../../reduxxx';
import {
  loadCategories,
  addCategory,
  deleteCategory,
  loadMediaElements,
  addMediaElement,
  deleteMediaElement,
  addBlogpost,
} from '../../state';
import { CategoryForm } from '../../components/category-form/category-form';
import { CategoryList } from '../../components/category-list/category-list';
import { PostForm } from '../../components/post-form/post-form';

export class NewPostPage extends React.Component {
  static contextType = ReducerContext;

  componentDidMount() {
    this.context.dispatch(loadCategories());
  }

  addCategory = (value) => this.context.dispatch(addCategory(value));

  deleteCategory = (uid) => this.context.dispatch(deleteCategory(uid));

  loadMediaElements = () => this.context.dispatch(loadMediaElements());

  addMediaElement = (description, image) =>
    this.context.dispatch(addMediaElement(description, image));

  deleteMediaElement = (uid) => this.context.dispatch(deleteMediaElement(uid));

  addBlogpost = (post) =>
    this.context
      .dispatch(addBlogpost(post))
      .then(
        () => this.props.history.replace('/'),
        (err) => console.error('Failed to create blogpost', err)
      );

  render() {
    const { categories, mediaElements } = this.context.state;

    return (
      <>
        <CategoryForm addCategory={this.addCategory} />
        <CategoryList
          categories={categories}
          deleteCategory={this.deleteCategory}
        />
        <hr />
        <PostForm
          categories={categories}
          mediaElements={mediaElements}
          loadMediaElements={this.loadMediaElements}
          addMediaElement={this.addMediaElement}
          deleteMediaElement={this.deleteMediaElement}
          addBlogpost={this.addBlogpost}
          method="post"
          defaultValues={{}}
        />
      </>
    );
  }
}
