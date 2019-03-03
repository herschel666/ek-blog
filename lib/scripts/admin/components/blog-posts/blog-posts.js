import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { BlogPostItem } from '../blog-post-item/blog-post-item';

export class Blogposts extends React.Component {
  static propTypes = {
    blogposts: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      })
    ).isRequired,
    blogpostsCount: PropTypes.number.isRequired,
    blogpostsNextPage: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
  };

  render() {
    const { blogposts, blogpostsCount, blogpostsNextPage, page } = this.props;

    return (
      <>
        <h1>
          {blogpostsCount} Post{blogpostsCount === 1 ? '' : 's'}
        </h1>
        {blogposts.map(({ uid, content, title, createdAt }) => (
          <BlogPostItem
            key={uid}
            page={page}
            uid={uid}
            content={content}
            title={title}
            createdAt={createdAt}
          />
        ))}
        {page === 2 && <Link to="/">Previous page</Link>}
        {page > 2 && <Link to={`/page/${page - 1}`}>Previous page</Link>}
        {blogpostsNextPage && (
          <Link to={`/page/${blogpostsNextPage}`}>Next page</Link>
        )}
      </>
    );
  }
}
