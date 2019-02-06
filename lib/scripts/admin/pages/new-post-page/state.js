import {
  api,
  CATEGORY_API_URL,
  BLOGPOST_API_URL,
  MEDIA_API_URL,
} from '../../api';

const ADD_CATEGORIES = 'app::ADD_CATEGORIES';
const ADD_MEDIA_ELEMENTS = 'app::ADD_MEDIA_ELEMENTS';

const addCategories = (payload) => ({
  type: ADD_CATEGORIES,
  payload,
});

const addMediaElements = (payload) => ({
  type: ADD_MEDIA_ELEMENTS,
  payload,
});

const initialState = {
  categories: [],
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

export const addBlogpost = ({ categories, content, title }) => async () => {
  const params = new URLSearchParams({
    content: content.trim(),
    title: title.trim(),
  });
  categories.forEach((uid) => params.append('categories', uid));
  await api.post(BLOGPOST_API_URL, params);
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
  await api.delete(`${BLOGPOSMEDIA_API_URLT_API_URL}/${uid}`);
  // TODO: handle error
  dispatch(loadMediaElements());
};

export const newPostReducer = (state = initialState, action) => {
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
        mediaElements: action.payload,
      };
    }

    default:
      return state;
  }
};
