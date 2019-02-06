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
  updateBlogpost,
  clearBlogpost,
} from '../../state';
import { PostForm } from '../../components/post-form/post-form';
import { MediaLibrary } from '../../components/media-library/media-library';

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
    this.context.dispatch(loadBlogpostDetail(this.props.match.params.uid));
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
    const { blogpostDetail, categories, mediaElements } = this.context.state;
    const defaultValues = blogpostDetail
      ? {
          categories: blogpostDetail.categories.map(({ uid }) => uid),
          title: blogpostDetail.title,
          content: blogpostDetail.content,
        }
      : null;
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
        {defaultValues && (
          <PostForm
            method="put"
            categories={categories}
            mediaLibrary={<MediaLibrary {...mediaLibraryProps} />}
            updateBlogpost={this.updateBlogpost}
            defaultValues={defaultValues}
          />
        )}
      </>
    );
  }
}
