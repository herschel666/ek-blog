import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ReducerContext } from '../../reduxxx';
import {
  loadCategories,
  loadMediaElements,
  addMediaElement,
  deleteMediaElement,
  loadBlogpostDetail,
  addBlogpost,
  updateBlogpost,
  clearBlogpost,
} from '../../state';
import { CategoryForm } from '../../components/category-form/category-form';
import { CategoryList } from '../../components/category-list/category-list';
import { PostForm } from '../../components/post-form/post-form';
import { MediaLibrary } from '../../components/media-library/media-library';

export class EditPostPage extends React.Component {
  static contextType = ReducerContext;
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        uid: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.context.dispatch(loadCategories());

    if (this.props.match.params.uid) {
      this.context.dispatch(loadBlogpostDetail(this.props.match.params.uid));
    }
  }

  componentWillUnmount() {
    this.context.dispatch(clearBlogpost());
  }

  loadMediaElements = () => this.context.dispatch(loadMediaElements());

  addMediaElement = (description, image) =>
    this.context.dispatch(addMediaElement(description, image));

  deleteMediaElement = (uid) => this.context.dispatch(deleteMediaElement(uid));

  handleSubmit = (values) => {
    const fn = Boolean(this.props.match.params.uid)
      ? updateBlogpost
      : addBlogpost;

    return this.context
      .dispatch(fn(values))
      .then(() => this.props.history.replace('/'));
  };

  render() {
    const { uid } = this.props.match.params;
    const isUpdate = Boolean(uid);
    const { blogpostDetail, categories, mediaElements } = this.context.state;
    const defaultValues =
      isUpdate && blogpostDetail
        ? {
            categories: blogpostDetail.categories.map(({ uid: cuid }) => cuid),
            title: blogpostDetail.title,
            content: blogpostDetail.content,
          }
        : null;
    const method = isUpdate ? 'put' : 'post';
    const mediaLibraryProps = {
      loadMediaElements: this.loadMediaElements,
      addMediaElement: this.addMediaElement,
      deleteMediaElement: this.deleteMediaElement,
      mediaElements,
    };

    return (
      <>
        <Link to="/">back to startpage</Link>
        <hr />
        <CategoryForm addCategory={this.addCategory} />
        <CategoryList
          categories={categories}
          deleteCategory={this.deleteCategory}
        />
        <hr />
        {(!isUpdate || defaultValues) && (
          <PostForm
            method={method}
            categories={categories}
            mediaLibrary={<MediaLibrary {...mediaLibraryProps} />}
            onSubmit={this.handleSubmit}
            defaultValues={defaultValues}
          />
        )}
      </>
    );
  }
}
