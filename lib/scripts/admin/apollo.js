import React from 'react';
import { ApolloProvider as Apollo } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import { api, BLOGPOST_API_URL, CATEGORY_API_URL, MEDIA_API_URL } from './api';

export const MUTATION_CREATE_CATEGORY = gql`
  mutation createCategory($category: NewCategory!) {
    createCategory(category: $category) @client {
      uid
      title
    }
  }
`;

export const MUTATION_DELETE_CATEGORY = gql`
  mutation deleteCategory($category: DeleteCategory!) {
    deleteCategory(category: $category) @client {
      uid
    }
  }
`;

export const QUERY_GET_CATEGORIES = gql`
  query getCategoryList {
    getCategoryList @client {
      uid
      title
    }
  }
`;

export const MUTATION_CREATE_POST = gql`
  mutation createPost($post: NewPost) {
    createPost(post: $post) @client {
      uid
      title
      content
      createdAt
    }
  }
`;

export const MUTATION_UPDATE_POST = gql`
  mutation updatePost($post: UpdatePost) {
    updatePost(post: $post) @client {
      uid
      title
      content
      createdAt
    }
  }
`;

export const MUTATION_DELETE_POST = gql`
  mutation deletePost($post: DeletePost) {
    deletePost(post: $post) @client {
      uid
    }
  }
`;

export const QUERY_GET_POSTS = gql`
  query getPostList($page: Int) {
    getPostList(page: $page) @client {
      count
      nextPage
      itemsPerPage
      posts {
        uid
        title
        content
        createdAt
      }
    }
  }
`;

export const QUERY_GET_POST_DETAIL = gql`
  query getPostDetail($uid: ID!) {
    getPostDetail(uid: $uid) @client {
      title
      content
      categories {
        uid
      }
    }
  }
`;

export const QUERY_GET_MEDIA_LIST = gql`
  query getMediaList($page: Int) {
    getMediaList(page: $page) @client {
      nextPage
      itemsPerPage
      media {
        uid
        root
        filehash
        ext
        description
      }
    }
  }
`;

export const MUTATION_CREATE_MEDIA = gql`
  mutation createMedia($media: NewMedia) {
    createMedia(media: $media) @client {
      uid
      root
      filehash
      ext
      description
    }
  }
`;

export const MUTATION_DELETE_MEDIA = gql`
  mutation deleteMedia($media: DeleteMedia) {
    deleteMedia(media: $media) @client {
      uid
    }
  }
`;

export const QUERY_GET_FORM_ERRORS = gql`
  query getFormErrors($type: FORM_TYPE) {
    getFormErrors(type: $type) @client {
      type
      field
      message
    }
  }
`;

export const MUTATION_CREATE_FORM_ERROR = gql`
  mutation createFormError($error: NewError) {
    createFormError(error: $error) @client {
      type
      field
      message
    }
  }
`;

const typeDefs = gql`
  enum FORM_TYPE {
    Category
    Media
    Post
  }

  type Media {
    uid: ID!
    createdAt: String!
    filehash: String!
    ext: String!
    description: String
  }

  type PaginatedMediaList {
    media: [Media]!
    itemsPerPage: Int!
    nextPage: Int
  }

  type Category {
    uid: ID!
    slug: String!
    title: String!
    createdAt: String!
    updatedAt: String
  }

  type Post {
    uid: ID!
    title: String!
    content: String!
    categories: [String!]!
    slug: String!
    createdAt: String!
    updatedAt: String
  }

  type PaginatedPostList {
    count: Int!
    posts: [Post!]!
    itemsPerPage: Int!
    nextPage: Int
  }

  type FormError {
    type: FORM_TYPE!
    field: String!
    message: String!
  }

  input NewPost {
    title: String!
    content: String!
    categories: [String!]!
  }

  input UpdatePost {
    uid: ID!
    title: String!
    content: String!
    categories: [String!]!
  }

  input DeletePost {
    uid: ID!
  }

  input NewCategory {
    title: String!
  }

  input UpdateCategory {
    uid: ID!
    title: String!
  }

  input DeleteCategory {
    uid: ID!
  }

  input NewMedia {
    media: String!
    description: String
  }

  input NewFormError {
    type: FORM_TYPE!
    field: String!
    message: String!
  }

  type Query {
    getCategoryList: [Category!]!
    getPostList(page: Int): PaginatedPostList!
    getPostDetail(uid: ID!): Post
    getMediaList(page: Int): PaginatedMediaList!
    getMedia(uid: ID!): Media
    getFormErrors(type: FORM_TYPE!): [FormError]!
  }

  type Mutation {
    createCategory(category: NewCategory!): Category
    updateCategory(category: UpdateCategory!): Category
    deleteCategory(category: DeleteCategory!): Category
    createPost(post: NewPost!): Post
    updatePost(post: UpdatePost!): Post
    deletePost(post: DeletePost): Post
    createMedia(media: NewMedia!): Media
    deleteMedia(media: DeleteMedia!): Media
    createFormError(error: NewFormError!): [FormError!]!
    clearFormErrors(type: FORM_TYPE): [FormError]
  }
`;

const handleResponse = (response, status) =>
  typeof status[response.status] === 'function'
    ? status[response.status]()
    : null;

const handleUserErrorForType = (type, cache, errors) => () => {
  if (errors && errors.length) {
    const data = {
      getFormErrors: errors.map((error) => ({
        ...error,
        __typename: 'FormError',
        type,
      })),
    };
    const variables = { type };
    cache.writeQuery({ query: QUERY_GET_FORM_ERRORS, variables, data });
  }

  return null;
};

const clearUserErrorForType = (type, cache) => {
  const data = { getFormErrors: [] };
  const variables = { type };
  cache.writeQuery({ query: QUERY_GET_FORM_ERRORS, variables, data });
};

const resolvers = {
  Query: {
    getCategoryList: async () => {
      try {
        const response = await api.get(CATEGORY_API_URL);
        const categories = await response.json();

        return categories.map((category) => ({
          ...category,
          __typename: 'Category',
        }));
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    getPostList: async (_, vars) => {
      try {
        const query =
          vars && typeof vars.page === 'number' ? `page=${vars.page}` : '';
        const response = await api.get(`${BLOGPOST_API_URL}?${query}`);
        const { posts, ...meta } = await response.json();

        return {
          ...meta,
          posts: posts.map((post) => ({ ...post, __typename: 'Post' })),
          __typename: 'PaginatedPostList',
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    getPostDetail: async (_, { uid }) => {
      try {
        const response = await api.get(`${BLOGPOST_API_URL}/${uid}`);
        const { post } = await response.json();

        return {
          ...post,
          __typename: 'Post',
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    getMediaList: async (_, vars) => {
      try {
        const query =
          vars && typeof vars.page === 'number' ? `page=${vars.page}` : '';
        const response = await api.get(`${MEDIA_API_URL}?${query}`);
        const { media, ...meta } = await response.json();

        return {
          ...meta,
          media: media.map((item) => ({ ...item, __typename: 'Media' })),
          __typename: 'PaginatedMediaList',
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    getMedia: async (_, { uid }) => {
      try {
        const response = await api.get(`${MEDIA_API_URL}/${uid}`);
        const { media } = await response.json();

        return {
          ...media,
          __typename: 'Media',
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    getFormErrors: (_, { type }, { cache }) => {
      const { getFormErrors } = cache.readQuery({
        query: QUERY_GET_FORM_ERRORS,
        variables: { type },
      });

      return getFormErrors;
    },
  },
  Mutation: {
    createCategory: async (_, { category }, { cache }) => {
      const params = new URLSearchParams({
        title: category.title.trim(),
      });
      const response = await api.post(CATEGORY_API_URL, params);
      const { body } = await response.json();

      const handleSuccess = () => {
        const data = cache.readQuery({ query: QUERY_GET_CATEGORIES });
        const newCategory = {
          ...body.category,
          __typename: 'Category',
        };

        data.getCategoryList.push(newCategory);
        cache.writeQuery({ query: QUERY_GET_CATEGORIES, data });
        clearUserErrorForType('Category', cache);

        return newCategory;
      };

      return handleResponse(response, {
        200: handleSuccess,
        400: handleUserErrorForType('Category', cache, body.errors),
      });
    },
    updateCategory: async (_, { category }) => {
      const { uid, title } = category;
      const params = new URLSearchParams({
        title: title.trim(),
      });
      const response = await api.put(`${CATEGORY_API_URL}/${uid}`, params);
      const { body } = await response.json();

      if (response.status !== 200) {
        console.error('Could not update category.');
        console.log(body);
        return null;
      }

      return {
        ...body.category,
        __typename: 'Category',
      };
    },
    deleteCategory: async (_, { category }, { cache }) => {
      try {
        await api.delete(`${CATEGORY_API_URL}/${category.uid}`);

        const data = cache.readQuery({ query: QUERY_GET_CATEGORIES });

        data.getCategoryList = data.getCategoryList.filter(
          ({ uid }) => uid !== category.uid
        );
        cache.writeQuery({ query: QUERY_GET_CATEGORIES, data });

        return category;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    createPost: async (_, { post }, { cache }) => {
      const { title, content, categories } = post;
      const params = new URLSearchParams({
        content: content.trim(),
        title: title.trim(),
      });
      categories.forEach((uid) => params.append('categories', uid));
      const response = await api.post(BLOGPOST_API_URL, params);
      const { body } = await response.json();

      const handleSuccess = () => {
        let newPost;
        try {
          const variables = {
            page: 1,
          };
          const data = cache.readQuery({ query: QUERY_GET_POSTS, variables });
          newPost = {
            ...body.post,
            __typename: 'Post',
          };

          data.getPostList.count = data.getPostList.count + 1;
          data.getPostList.posts.unshift(newPost);
          cache.writeQuery({ query: QUERY_GET_POSTS, variables, data });
          clearUserErrorForType('Post', cache);
        } catch (e) {}

        return newPost;
      };

      return handleResponse(response, {
        200: handleSuccess,
        400: handleUserErrorForType('Post', cache, body.errors),
      });
    },
    updatePost: async (_, { post }, { cache }) => {
      const variables = { uid: post.uid };
      const data = cache.readQuery({
        query: QUERY_GET_POST_DETAIL,
        variables,
      });
      const { categories, content, title } = { ...data.getPostDetail, ...post };
      const params = new URLSearchParams({
        content: content.trim(),
        title: title.trim(),
      });
      categories.forEach((cuid) => params.append('categories', cuid));
      const response = await api.put(`${BLOGPOST_API_URL}/${post.uid}`, params);
      const { body } = await response.json();

      if (response.status !== 200) {
        console.error('Could not update post.');
        console.log(body);
        return null;
      }

      return {
        ...body.post,
        __typename: 'Post',
      };
    },
    deletePost: async (_, { post }) => {
      try {
        await api.delete(`${BLOGPOST_API_URL}/${post.uid}`);
        return post;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    createMedia: async (_, { media: mediaPayload }, { cache }) => {
      const { media, description } = mediaPayload;
      const params = new URLSearchParams({
        ...(description ? { description } : {}),
        media,
      });
      const response = await api.post(MEDIA_API_URL, params);
      const { body } = await response.json();

      const handleSuccess = () => {
        clearUserErrorForType('Media', cache);

        return {
          ...body.media,
          __typename: 'Media',
        };
      };

      return handleResponse(response, {
        200: handleSuccess,
        400: handleUserErrorForType('Media', cache, body.errors),
      });
    },
    deleteMedia: async (_, { media }) => {
      try {
        await api.delete(`${MEDIA_API_URL}/${media.uid}`);
        return media;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    createFormError: (_, { error }, { cache }) => {
      cache.writeData({
        data: {
          getFormErrors: [error],
        },
        variables: { type: error.type },
      });
      return error;
    },
    clearFormErrors: (_, { type }) => {
      let errors = [];

      if (type) {
        const { getFormErrors } = cache.readQuery({
          query: QUERY_GET_FORM_ERRORS,
        });
        errors = getFormErrors.filter((error) => error.type === type);
      }

      cache.writeData({
        data: {
          getFormErrors: errors,
        },
      });
      return null;
    },
  },
};

const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case 'FormError':
        return `${object.type.toLowerCase()}-${object.field}`;
      default:
        return object.uid || object.id;
    }
  },
});
const defaults = {
  getCategoryList: [],
  getPostList: [],
  getMediaList: [],
  getFormErrors: [],
};
const client = new ApolloClient({
  cache,
  resolvers,
  typeDefs,
  defaults,
});

export const ApolloProvider = ({ children }) => (
  <Apollo client={client}>{children}</Apollo>
);
