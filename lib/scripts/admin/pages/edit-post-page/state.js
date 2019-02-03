import { api, BLOGPOST_API_URL } from '../../api';

const ADD_BLOGPOST = 'editPost::ADD_BLOGPOST';

const addBlogpost = (payload) => ({
  type: ADD_BLOGPOST,
  payload,
});

const initialState = {
  blogpost: null,
};

export const loadBlogpost = (uid) => async (dispatch) => {
  const response = await api.get(`${BLOGPOST_API_URL}/${uid}`);
  const blogpost = await response.json();
  // TODO: handle error
  dispatch(addBlogpost(blogpost));
};

export const editPostReducer = (state = initialState, action) => {
  switch (action.type) {
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
