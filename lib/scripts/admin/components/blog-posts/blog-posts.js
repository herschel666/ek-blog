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

export const Blogposts = ({ posts, count, apiUrl, deleteBlogpost }) => (
  <>
    <h1>
      {count} Post{count === 1 ? '' : 's'}
    </h1>
    {posts.map(({ uid, content, title, createdAt }) => (
      <div>
        <h2>
          <Link to={`/edit/${uid}`}>{title}</Link>
        </h2>
        <strong>
          Created at
          <time datetime={createdAt}>{createdAt}</time>
        </strong>
        <p>{getIntro(content)}</p>
        <form
          method="delete"
          action={`${apiUrl}/${uid}`}
          onSubmit={deleteBlogpost}
        >
          <button>Delete</button>
        </form>
      </div>
    ))}
  </>
);

Blogposts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  count: PropTypes.number.isRequired,
  apiUrl: PropTypes.string.isRequired,
  deleteBlogpost: PropTypes.func.isRequired,
};
