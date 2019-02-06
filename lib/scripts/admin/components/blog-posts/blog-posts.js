import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { Link } from 'react-router-dom';

const getIntro = (content) => {
  const elem = document.createElement('div');
  elem.innerHTML = marked(content);
  const parts = elem.textContent.split(/\s+/);

  if (parts.length <= 20) {
    return parts.join(' ');
  }

  return `${parts.slice(0, 20).join(' ')} [\u2026]`;
};

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
    deleteBlogpost: PropTypes.func.isRequired,
  };

  deleteBlogpost = (uid) => () => {
    if (!confirm('Do you really want to delete this post?')) {
      return;
    }

    this.props.deleteBlogpost(uid);
  };

  render() {
    const { blogposts, blogpostsCount, blogpostsNextPage, page } = this.props;

    return (
      <>
        <h1>
          {blogpostsCount} Post{blogpostsCount === 1 ? '' : 's'}
        </h1>
        {blogposts.map(({ uid, content, title, createdAt }) => (
          <div>
            <h2>
              <Link to={`/edit/${uid}`}>{title}</Link>
            </h2>
            <strong>
              Created at
              <time datetime={createdAt}>{createdAt}</time>
            </strong>
            <p>{getIntro(content)}</p>
            <button onClick={this.deleteBlogpost(uid)}>Delete</button>
          </div>
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
