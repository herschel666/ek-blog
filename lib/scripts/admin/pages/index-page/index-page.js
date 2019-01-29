import React from 'react';

import {
  CATEGORY_API_URL,
  BLOGPOST_API_URL,
  MEDIA_API_URL,
  api,
} from '../../api';
import { Blogposts } from '../../components/blog-posts/blog-posts';
import { CategoryForm } from '../../components/category-form/category-form';
import { CategoryList } from '../../components/category-list/category-list';
import { PostForm } from '../../components/post-form/post-form';
import { MediaForm } from '../../components/media-form/media-form';

export class IndexPage extends React.Component {
  state = {
    categories: [],
    posts: [],
    media: [],
  };

  componentDidMount() {
    this.fetchCategories();
    this.fetchBlogposts();
    this.fetchMedia();
  }

  async fetchCategories() {
    const request = await fetch(CATEGORY_API_URL);
    const categories = await request.json();

    this.setState({ categories });
  }

  addCategory = async (value) => {
    await api.post(CATEGORY_API_URL, `title=${encodeURIComponent(value)}`);
    this.fetchCategories();
  };

  deleteCategory = async (url) => {
    const request = await api.delete(url);

    if (request.status === 202) {
      this.fetchCategories();
      return;
    }

    const response = await request.json();
    console.log(request, response);
  };

  async fetchBlogposts() {
    const request = await api.get(BLOGPOST_API_URL);
    const response = await request.json();

    this.setState(response);
  }

  addBlogpost = async (params) => {
    await api.post(BLOGPOST_API_URL, params);
    this.fetchBlogposts();
  };

  deleteBlogpost = async (evnt) => {
    evnt.preventDefault();
    await api.delete(evnt.target.action);
    this.fetchBlogposts();
  };

  async fetchMedia() {
    const request = await fetch(MEDIA_API_URL);
    const media = await request.json();

    this.setState({ media });
  }

  addMedia = async (url, body) => {
    await api.post(url, body);
    await this.fetchMedia();
  };

  deleteImage = async (url) => {
    await api.delete(url);
    await this.fetchMedia();
  };

  render() {
    return (
      <>
        <CategoryForm
          apiUrl={CATEGORY_API_URL}
          addCategory={this.addCategory}
        />
        <CategoryList
          categories={this.state.categories}
          apiUrl={CATEGORY_API_URL}
          deleteCategory={this.deleteCategory}
        />
        <MediaForm apiUrl={MEDIA_API_URL} addMedia={this.addMedia} />
        <PostForm
          categories={this.state.categories}
          postApiUrl={BLOGPOST_API_URL}
          addBlogpost={this.addBlogpost}
          media={this.state.media}
          mediaApiUrl={MEDIA_API_URL}
          deleteImage={this.deleteImage}
          defaultValues={{}}
        />
        <Blogposts
          posts={this.state.posts}
          count={this.state.count}
          apiUrl={`${BLOGPOST_API_URL}`}
          deleteBlogpost={this.deleteBlogpost}
        />
      </>
    );
  }
}
