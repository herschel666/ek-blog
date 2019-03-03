import React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  QUERY_GET_POST_DETAIL,
  QUERY_GET_FORM_ERRORS,
  MUTATION_CREATE_POST,
  MUTATION_UPDATE_POST,
} from '../../apollo';
import { CategoryEditor } from '../../components/category-editor/category-editor';
import { PostForm } from '../../components/post-form/post-form';

export class EditPostPageComponent extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        uid: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  handleSubmit = (post) => {
    const isUpdate = Boolean(this.props.match.params.uid);
    const mutation = isUpdate ? MUTATION_UPDATE_POST : MUTATION_CREATE_POST;

    post.__typename = 'Post';

    if (isUpdate) {
      post.uid = this.props.match.params.uid;
    }

    return this.props.client
      .mutate({
        mutation,
        variables: { post },
      })
      .then(() =>
        this.props.client.query({
          query: QUERY_GET_FORM_ERRORS,
          variables: { type: 'Post' },
        })
      )
      .then(({ data: { getFormErrors: postFormErrors } }) => {
        if (!postFormErrors || postFormErrors.length === 0) {
          this.props.history.replace('/');
        }
      });
  };

  render() {
    const { uid } = this.props.match.params;
    const isUpdate = Boolean(uid);
    const { blogpostDetail } = this.props;
    const defaultValues = blogpostDetail
      ? {
          categories: blogpostDetail.categories.map(({ uid: cuid }) => cuid),
          title: blogpostDetail.title,
          content: blogpostDetail.content,
        }
      : null;
    const method = isUpdate ? 'put' : 'post';

    return (
      <>
        <Link to="/">back to startpage</Link>
        <hr />
        <CategoryEditor />
        <hr />
        {(!isUpdate || defaultValues) && (
          <PostForm
            method={method}
            onSubmit={this.handleSubmit}
            defaultValues={defaultValues}
          />
        )}
      </>
    );
  }
}

export const EditPostPage = (props) => (
  <ApolloConsumer>
    {(client) =>
      Boolean(props.match.params.uid) ? (
        <Query
          query={QUERY_GET_POST_DETAIL}
          variables={{ uid: props.match.params.uid }}
        >
          {({ data: { getPostDetail: blogpostDetail } }) => (
            <EditPostPageComponent
              {...props}
              client={client}
              blogpostDetail={blogpostDetail}
            />
          )}
        </Query>
      ) : (
        <EditPostPageComponent {...props} client={client} />
      )
    }
  </ApolloConsumer>
);
