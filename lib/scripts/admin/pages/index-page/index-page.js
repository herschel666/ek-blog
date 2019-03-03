import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { QUERY_GET_POSTS } from '../../apollo';

import { Blogposts } from '../../components/blog-posts/blog-posts';

export const IndexPage = ({ match }) => {
  const page = Number(match.params.page || '1');

  return (
    <>
      <Link to="/new-post">Create new post</Link>
      <hr />
      <Query query={QUERY_GET_POSTS} variables={{ page }}>
        {({ data, loading }) => {
          if (loading || !data.getPostList) {
            return <p>Loading posts…</p>;
          }

          const { count, nextPage, posts } = data.getPostList;

          return (
            <Blogposts
              blogposts={posts}
              blogpostsCount={count}
              blogpostsNextPage={nextPage}
              page={page}
            />
          );
        }}
      </Query>
    </>
  );
};
