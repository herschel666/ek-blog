import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ReducerContext } from '../../reduxxx';
import {
  loadMediaElements,
  addMediaElement,
  deleteMediaElement,
} from '../../state';
import {
  loadCategories,
  loadBlogpost,
  updateBlogpost,
  clearBlogpost,
} from './state';
import { PostForm } from '../../components/post-form/post-form';

export class EditPostPage extends React.Component {
  static contextType = ReducerContext;
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        uid: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.context.dispatch(loadCategories());
    this.context.dispatch(loadBlogpost(this.props.match.params.uid));
  }

  componentWillUnmount() {
    this.context.dispatch(clearBlogpost());
  }

  loadMediaElements = () => this.context.dispatch(loadMediaElements());

  addMediaElement = (description, image) =>
    this.context.dispatch(addMediaElement(description, image));

  deleteMediaElement = (uid) => this.context.dispatch(deleteMediaElement(uid));

  updateBlogpost = (values) =>
    this.context
      .dispatch(updateBlogpost(values))
      .then(
        () => this.props.history.replace('/'),
        (err) => console.error('Failed to update blogpost', err)
      );

  render() {
    const { mediaElements } = this.context.state.app;
    const { blogpost, categories } = this.context.state.editPost;
    const defaultValues = blogpost
      ? {
          categories: blogpost.categories.map(({ uid }) => uid),
          title: blogpost.title,
          content: blogpost.content,
        }
      : null;

    return (
      <>
        <Link to="/">back to startpage</Link>
        <hr />
        {defaultValues && (
          <PostForm
            method="put"
            categories={categories}
            mediaElements={mediaElements}
            loadMediaElements={this.loadMediaElements}
            addMediaElement={this.addMediaElement}
            deleteMediaElement={this.deleteMediaElement}
            updateBlogpost={this.updateBlogpost}
            defaultValues={defaultValues}
          />
        )}
      </>
    );
  }
}
