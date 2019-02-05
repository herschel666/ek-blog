import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { loadBlogpost } from './state';
import { ReducerContext } from '../../reduxxx';
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

  async componentDidMount() {
    await this.context.dispatch(loadBlogpost(this.props.match.params.uid));
  }

  render() {
    const { blogpost } = this.context.state.editPost;
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
            uid={this.props.match.params.uid}
            defaultValues={defaultValues}
          />
        )}
      </>
    );
  }
}
