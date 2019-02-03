import { api, CATEGORY_API_URL, BLOGPOST_API_URL, MEDIA_API_URL } from './api';

const ADD_CATEGORIES = 'app::ADD_CATEGORIES';
const ADD_BLOGPOSTS = 'app::ADD_BLOGPOSTS';
const ADD_MEDIA_ELEMENTS = 'app::ADD_MEDIA_ELEMENTS';

const addCategories = (payload) => ({
  type: ADD_CATEGORIES,
  payload,
});

const addBlogposts = (payload) => ({
  type: ADD_BLOGPOSTS,
  payload,
});

const addMediaElements = (payload) => ({
  type: ADD_MEDIA_ELEMENTS,
  payload,
});

const initialState = {
  categories: [],
  blogposts: [],
  blogpostsCount: 0,
  mediaElements: [],
};

export const loadCategories = () => async (dispatch) => {
  const response = await api.get(CATEGORY_API_URL);
  const categories = await response.json();
  dispatch(addCategories(categories));
};

export const addCategory = (value) => async (dispatch) => {
  await api.post(CATEGORY_API_URL, `title=${encodeURIComponent(value)}`);
  // TODO: handle error
  dispatch(loadCategories());
};

export const deleteCategory = (uid) => async (dispatch) => {
  const request = await api.delete(`${CATEGORY_API_URL}/${uid}`);

  if (request.status === 202) {
    dispatch(loadCategories());
  }
  // TODO: handle error
};

export const loadBlogposts = () => async (dispatch) => {
  const response = await api.get(BLOGPOST_API_URL);
  const blogposts = await response.json();
  dispatch(addBlogposts(blogposts));
};

export const addBlogpost = ({ categories, content, title }) => async (
  dispatch
) => {
  const params = new URLSearchParams({
    content: content.trim(),
    title: title.trim(),
  });
  categories.forEach((uid) => params.append('categories', uid));
  await api.post(BLOGPOST_API_URL, params);
  // TODO: handle error
  dispatch(loadBlogposts());
};

export const updateBlogpost = (uid, values) => async (dispatch, getState) => {
  const { blogposts } = getState().app;
  const defaults = blogposts.find(({ uid: id }) => uid === id);
  const { categories, content, title } = { ...defaults, ...values };
  const params = new URLSearchParams({
    content: content.trim(),
    title: title.trim(),
  });
  categories.forEach((uid) => params.append('categories', uid));
  await api.put(`${BLOGPOST_API_URL}/${uid}`, params);
  // TODO: handle error
  dispatch(loadBlogposts());
};

export const deleteBlogpost = (uid) => async (dispatch) => {
  await api.delete(`${BLOGPOST_API_URL}/${uid}`);
  // TODO: handle error
  dispatch(loadBlogposts());
};

export const loadMediaElements = () => async (dispatch) => {
  const response = await api.get(MEDIA_API_URL);
  const mediaElements = await response.json();
  dispatch(addMediaElements(mediaElements));
};

export const addMediaElement = (description, image) => async (dispatch) => {
  const payload = new URLSearchParams({
    description,
    image,
  });
  await api.post(MEDIA_API_URL, payload.toString());
  // TODO: handle error
  dispatch(loadMediaElements());
};

export const deleteImage = (uid) => async (dispatch) => {
  await api.delete(`${BLOGPOSMEDIA_API_URLT_API_URL}/${uid}`);
  // TODO: handle error
  dispatch(loadMediaElements());
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CATEGORIES: {
      return {
        ...state,
        categories: action.payload,
      };
    }

    case ADD_BLOGPOSTS: {
      return {
        ...state,
        blogposts: action.payload.posts,
        blogpostsCount: action.payload.count,
      };
    }

    case ADD_MEDIA_ELEMENTS: {
      return {
        ...state,
        mediaElements: action.payload,
      };
    }

    default:
      return state;
  }
};
