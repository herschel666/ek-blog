import { api, CATEGORY_API_URL, MEDIA_API_URL, BLOGPOST_API_URL } from './api';

const ADD_CATEGORIES = 'ADD_CATEGORIES';
const ADD_CATEGORY_FORM_ERRORS = 'ADD_CATEGORY_FORM_ERRORS';
const ADD_MEDIA_ELEMENTS = 'ADD_MEDIA_ELEMENTS';
const ADD_MEDIA_ELEMENTS_PAGE = 'ADD_MEDIA_ELEMENTS_PAGE';
const ADD_MEDIA_FORM_ERRORS = 'ADD_MEDIA_FORM_ERRORS';
const ADD_BLOGPOSTS = 'ADD_BLOGPOSTS';
const ADD_BLOGPOST_DETAIL = 'ADD_BLOGPOST_DETAIL';
const ADD_BLOGPOST_FORM_ERRORS = 'ADD_BLOGPOST_FORM_ERRORS';

const addCategories = (payload) => ({
  type: ADD_CATEGORIES,
  payload,
});

const addCategoryFormErrors = (payload) => ({
  type: ADD_CATEGORY_FORM_ERRORS,
  payload,
});

const addMediaElements = (payload) => ({
  type: ADD_MEDIA_ELEMENTS,
  payload,
});

const addMediaFormErrors = (payload) => ({
  type: ADD_MEDIA_FORM_ERRORS,
  payload,
});

const setMediaElementsPage = (payload) => ({
  type: ADD_MEDIA_ELEMENTS_PAGE,
  payload,
});

const addBlogposts = (payload) => ({
  type: ADD_BLOGPOSTS,
  payload,
});

const addBlogpostDetail = (payload) => ({
  type: ADD_BLOGPOST_DETAIL,
  payload,
});

const addPostFormErrors = (payload) => ({
  type: ADD_BLOGPOST_FORM_ERRORS,
  payload,
});

const initialState = {
  categories: [],
  categoryFormErrors: [],
  mediaElements: [],
  mediaFormErrors: [],
  mediaElementsCurrentPage: 1,
  mediaElementsNextPage: null,
  blogposts: [],
  blogpostsCount: 0,
  blogpostsNextPage: null,
  blogpostDetail: null,
  postFormErrors: [],
};

export const loadCategories = () => async (dispatch) => {
  const response = await api.get(CATEGORY_API_URL);
  const categories = await response.json();
  dispatch(addCategories(categories));
};

export const addCategory = (title) => async (dispatch) => {
  const response = await api.post(
    CATEGORY_API_URL,
    `title=${encodeURIComponent(title)}`
  );
  const { body } = await response.json();

  if (body && body.errors) {
    dispatch(addCategoryFormErrors(body.errors));
  } else {
    dispatch(addCategoryFormErrors([]));
    dispatch(loadCategories());
  }
};

export const deleteCategory = (uid) => async (dispatch) => {
  const request = await api.delete(`${CATEGORY_API_URL}/${uid}`);

  if (request.status === 202) {
    dispatch(loadCategories());
  }
  // TODO: handle error
};

export const loadMediaElements = () => async (dispatch, getState) => {
  const { mediaElementsCurrentPage } = getState();
  const response = await api.get(
    `${MEDIA_API_URL}?page=${mediaElementsCurrentPage}`
  );
  const mediaElements = await response.json();
  dispatch(addMediaElements(mediaElements));
};

export const createMediaElement = (description, media) => async (dispatch) => {
  const payload = new URLSearchParams({
    ...(description ? { description } : {}),
    media,
  });
  const response = await api.post(MEDIA_API_URL, payload.toString());
  const { body } = await response.json();
  const errors = (body && body.errors) || [];

  dispatch(addMediaFormErrors(errors));
  if (errors.length === 0) {
    dispatch(loadMediaElements());
  }
};

export const invalidateMediaForm = (errors) => async (dispatch) =>
  dispatch(addMediaFormErrors(errors));

export const deleteMediaElement = (uid) => async (dispatch) => {
  await api.delete(`${MEDIA_API_URL}/${uid}`);
  // TODO: handle error
  dispatch(loadMediaElements());
};

export const setMediaElementsCurrentPage = (page) => async (dispatch) => {
  await dispatch(setMediaElementsPage(page));
  await dispatch(loadMediaElements());
};

export const loadBlogposts = (page) => async (dispatch) => {
  const query = page ? `page=${page}` : '';
  const response = await api.get(`${BLOGPOST_API_URL}?${query}`);
  const blogposts = await response.json();
  dispatch(addBlogposts(blogposts));
};

export const addBlogpost = (payload) => async (dispatch) => {
  const { categories, content, title } = payload;
  const params = new URLSearchParams({
    content: content.trim(),
    title: title.trim(),
  });
  categories.forEach((uid) => params.append('categories', uid));
  const response = await api.post(BLOGPOST_API_URL, params);
  const { body } = await response.json();

  // TODO: consider checking response payload type explicitly.
  await dispatch(addPostFormErrors((body && body.errors) || []));
};

export const deleteBlogpost = (uid) => async (dispatch) => {
  await api.delete(`${BLOGPOST_API_URL}/${uid}`);
  // TODO: handle error
  dispatch(loadBlogposts());
};

export const loadBlogpostDetail = (uid) => async (dispatch) => {
  const response = await api.get(`${BLOGPOST_API_URL}/${uid}`);
  const blogpost = await response.json();
  // TODO: handle error
  dispatch(addBlogpostDetail(blogpost));
};

export const updateBlogpost = (values) => async (dispatch, getState) => {
  const { uid, ...blogpost } = getState().blogpostDetail;
  const { categories, content, title } = { ...blogpost, ...values };
  const params = new URLSearchParams({
    content: content.trim(),
    title: title.trim(),
  });
  categories.forEach((cuid) => params.append('categories', cuid));
  const response = await api.put(`${BLOGPOST_API_URL}/${uid}`, params);
  const { body } = await response.json();

  // TODO: consider checking response payload type explicitly.
  await dispatch(addPostFormErrors((body && body.errors) || []));
};

export const clearBlogpost = () => addBlogpostDetail(null);

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CATEGORIES: {
      return {
        ...state,
        categories: action.payload,
      };
    }

    case ADD_CATEGORY_FORM_ERRORS: {
      return {
        ...state,
        categoryFormErrors: action.payload,
      };
    }

    case ADD_MEDIA_ELEMENTS: {
      return {
        ...state,
        mediaElements: action.payload.media,
        mediaElementsNextPage: action.payload.nextPage,
      };
    }

    case ADD_MEDIA_FORM_ERRORS: {
      return {
        ...state,
        mediaFormErrors: action.payload,
      };
    }

    case ADD_MEDIA_ELEMENTS_PAGE: {
      return {
        ...state,
        mediaElementsCurrentPage: action.payload,
      };
    }

    case ADD_BLOGPOSTS: {
      return {
        ...state,
        blogposts: action.payload.posts,
        blogpostsCount: action.payload.count,
        blogpostsNextPage: action.payload.nextPage,
      };
    }

    case ADD_BLOGPOST_DETAIL: {
      return {
        ...state,
        blogpostDetail: action.payload,
      };
    }

    case ADD_BLOGPOST_FORM_ERRORS: {
      return {
        ...state,
        postFormErrors: action.payload,
      };
    }

    default:
      return state;
  }
};
