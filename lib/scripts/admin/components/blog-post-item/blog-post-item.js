import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import marked from 'marked';

import { QUERY_GET_POSTS, MUTATION_DELETE_POST } from '../../apollo';

const getIntro = (content) => {
  const elem = document.createElement('div');
  elem.innerHTML = marked(content);
  const parts = elem.textContent.split(/\s+/);

  if (parts.length <= 20) {
    return parts.join(' ');
  }

  return `${parts.slice(0, 20).join(' ')} [\u2026]`;
};

export const BlogPostItem = ({ uid, title, content, createdAt, page }) => (
  <Mutation
    mutation={MUTATION_DELETE_POST}
    variables={{ post: { __typename: 'DeletePost', uid } }}
    refetchQueries={[{ query: QUERY_GET_POSTS, variables: { page } }]}
  >
    {(deletePost) => (
      <div>
        <h2>
          <Link to={`/edit/${uid}`}>{title}</Link>
        </h2>
        <strong>
          Created at
          <time datetime={createdAt}>{createdAt}</time>
        </strong>
        <p>{getIntro(content)}</p>
        <button onClick={deletePost}>Delete</button>
      </div>
    )}
  </Mutation>
);

BlogPostItem.propTypes = {
  uid: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
};
