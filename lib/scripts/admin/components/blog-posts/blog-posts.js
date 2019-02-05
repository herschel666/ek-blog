import React from 'react';
import marked from 'marked';
import { Link } from 'react-router-dom';

import { ReducerContext } from '../../reduxxx';
import { deleteBlogpost } from '../../state';

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
  static contextType = ReducerContext;

  deleteBlogpost = (uid) => () => {
    if (!confirm('Do you really want to delete this post?')) {
      return;
    }

    this.context.dispatch(deleteBlogpost(uid));
  };

  render() {
    const { blogposts, blogpostsCount } = this.context.state.app;
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
      </>
    );
  }
}
