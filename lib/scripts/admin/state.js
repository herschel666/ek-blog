import { api, CATEGORY_API_URL, MEDIA_API_URL, BLOGPOST_API_URL } from './api';

const ADD_CATEGORIES = 'ADD_CATEGORIES';
const ADD_MEDIA_ELEMENTS = 'ADD_MEDIA_ELEMENTS';
const ADD_BLOGPOSTS = 'ADD_BLOGPOSTS';
const ADD_BLOGPOST_DETAIL = 'ADD_BLOGPOST_DETAIL';

const addCategories = (payload) => ({
  type: ADD_CATEGORIES,
  payload,
});

const addMediaElements = (payload) => ({
  type: ADD_MEDIA_ELEMENTS,
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

const initialState = {
  categories: [],
  mediaElements: [],
  mediaElementsNextPage: null,
  blogposts: [],
  blogpostsCount: 0,
  blogpostsNextPage: null,
  blogpostDetail: null,
};

export const loadCategories = () => async (dispatch) => {
  const response = await api.get(CATEGORY_API_URL);
  const categories = await response.json();
  dispatch(addCategories(categories));
};

export const addCategory = (title) => async (dispatch) => {
  await api.post(CATEGORY_API_URL, `title=${encodeURIComponent(title)}`);
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

export const deleteMediaElement = (uid) => async (dispatch) => {
  await api.delete(`${MEDIA_API_URL}/${uid}`);
  // TODO: handle error
  dispatch(loadMediaElements());
};

export const loadBlogposts = (page) => async (dispatch) => {
  const query = page ? `page=${page}` : '';
  const response = await api.get(`${BLOGPOST_API_URL}?${query}`);
  const blogposts = await response.json();
  dispatch(addBlogposts(blogposts));
};

export const addBlogpost = ({ categories, content, title }) => async () => {
  const params = new URLSearchParams({
    content: content.trim(),
    title: title.trim(),
  });
  categories.forEach((uid) => params.append('categories', uid));
  await api.post(BLOGPOST_API_URL, params);
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

export const updateBlogpost = (values) => async (_, getState) => {
  const { uid, ...blogpost } = getState().blogpostDetail;
  const { categories, content, title } = { ...blogpost, ...values };
  const params = new URLSearchParams({
    content: content.trim(),
    title: title.trim(),
  });
  categories.forEach((cuid) => params.append('categories', cuid));
  await api.put(`${BLOGPOST_API_URL}/${uid}`, params);
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

    case ADD_MEDIA_ELEMENTS: {
      return {
        ...state,
        mediaElements: action.payload.media,
        mediaElementsNextPage: action.payload.nextPage,
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

    default:
      return state;
  }
};
