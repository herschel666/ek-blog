import React from 'react';

import { Blogposts } from '../../components/blog-posts/blog-posts';
import { CategoryForm } from '../../components/category-form/category-form';
import { CategoryList } from '../../components/category-list/category-list';
import { PostForm } from '../../components/post-form/post-form';

export class IndexPage extends React.Component {
  render() {
    console.log('state', this.context.state);

    return (
      <>
        <CategoryForm />
        <CategoryList />
        <hr />
        <PostForm method="post" defaultValues={{}} />
        <Blogposts />
      </>
    );
  }
}
