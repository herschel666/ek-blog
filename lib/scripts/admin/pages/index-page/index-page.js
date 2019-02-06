import React from 'react';
import { Link } from 'react-router-dom';

import { ReducerContext } from '../../reduxxx';
import { loadBlogposts, deleteBlogpost } from './state';
import { Blogposts } from '../../components/blog-posts/blog-posts';

export class IndexPage extends React.Component {
  static contextType = ReducerContext;

  componentDidMount() {
    this.context.dispatch(
      loadBlogposts(Number(this.props.match.params.page || '1'))
    );
  }

  deleteBlogpost = (uid) => this.context.dispatch(deleteBlogpost(uid));

  render() {
    const page = Number(this.props.match.params.page || '1');
    const {
      blogposts,
      blogpostsCount,
      blogpostsNextPage,
    } = this.context.state.index;

    return (
      <>
        <Link to="/new-post">Create new post</Link>
        <hr />
        <Blogposts
          blogposts={blogposts}
          blogpostsCount={blogpostsCount}
          blogpostsNextPage={blogpostsNextPage}
          page={page}
          deleteBlogpost={this.deleteBlogpost}
        />
      </>
    );
  }
}
