import { api, CATEGORY_API_URL, BLOGPOST_API_URL } from '../../api';

const ADD_CATEGORIES = 'app::ADD_CATEGORIES';
const ADD_BLOGPOST = 'editPost::ADD_BLOGPOST';

// TODO: add complete category-loading-shizzle into shared file
const addCategories = (payload) => ({
  type: ADD_CATEGORIES,
  payload,
});

const addBlogpost = (payload) => ({
  type: ADD_BLOGPOST,
  payload,
});

const initialState = {
  categories: [],
  blogpost: null,
};

export const loadCategories = () => async (dispatch) => {
  const response = await api.get(CATEGORY_API_URL);
  const categories = await response.json();
  dispatch(addCategories(categories));
};

export const loadBlogpost = (uid) => async (dispatch) => {
  const response = await api.get(`${BLOGPOST_API_URL}/${uid}`);
  const blogpost = await response.json();
  // TODO: handle error
  dispatch(addBlogpost(blogpost));
};

export const updateBlogpost = (values) => async (_, getState) => {
  const { uid, ...blogpost } = getState().editPost.blogpost;
  const { categories, content, title } = { ...blogpost, ...values };
  const params = new URLSearchParams({
    content: content.trim(),
    title: title.trim(),
  });
  categories.forEach((cuid) => params.append('categories', cuid));
  await api.put(`${BLOGPOST_API_URL}/${uid}`, params);
};

export const clearBlogpost = () => addBlogpost(null);

export const editPostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CATEGORIES: {
      return {
        ...state,
        categories: action.payload,
      };
    }

    case ADD_BLOGPOST: {
      return {
        ...state,
        blogpost: action.payload,
      };
    }

    default:
      return state;
  }
};
