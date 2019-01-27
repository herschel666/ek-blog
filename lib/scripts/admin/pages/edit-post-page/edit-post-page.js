import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { CATEGORY_API_URL, BLOGPOST_API_URL, api } from '../../api';
import { PostForm } from '../../components/post-form/post-form';

export class EditPostPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        uid: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    categories: [],
  };

  componentDidMount() {
    this.fetchCategories();
    this.fetchBlogpost(this.props.match.params.uid);
  }

  async fetchCategories() {
    const request = await api.get(CATEGORY_API_URL);
    const categories = await request.json();

    this.setState({ categories });
  }

  async fetchBlogpost(uid) {
    const request = await api.get(`${BLOGPOST_API_URL}/${uid}`);
    const post = await request.json();

    this.setState({ post });
  }

  updateBlogpost = async (params) => {
    try {
      const { uid } = this.props.match.params;
      await api.put(`${BLOGPOST_API_URL}/${uid}`, params);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const defaultValues = this.state.post
      ? {
          categories: this.state.post.categories.map(({ uid }) => uid),
          title: this.state.post.title,
          content: this.state.post.content,
        }
      : null;

    return (
      <>
        <Link to="/">back to startpage</Link>
        <hr />
        {defaultValues && (
          <PostForm
            method="put"
            apiUrl={`${BLOGPOST_API_URL}/${this.props.match.params.uid}`}
            categories={this.state.categories}
            defaultValues={defaultValues}
            updateBlogpost={this.updateBlogpost}
          />
        )}
      </>
    );
  }
}
