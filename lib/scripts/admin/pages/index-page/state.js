import { api, BLOGPOST_API_URL } from '../../api';

const ADD_BLOGPOSTS = 'app::ADD_BLOGPOSTS';

const addBlogposts = (payload) => ({
  type: ADD_BLOGPOSTS,
  payload,
});

const initialState = {
  blogposts: [],
  blogpostsCount: 0,
  blogpostsNextPage: null,
};

export const loadBlogposts = (page) => async (dispatch) => {
  const response = await api.get(`${BLOGPOST_API_URL}?page=${page}`);
  const blogposts = await response.json();
  dispatch(addBlogposts(blogposts));
};

export const deleteBlogpost = (uid) => async (dispatch) => {
  await api.delete(`${BLOGPOST_API_URL}/${uid}`);
  // TODO: handle error
  dispatch(loadBlogposts());
};

export const indexReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BLOGPOSTS: {
      return {
        ...state,
        blogposts: action.payload.posts,
        blogpostsCount: action.payload.count,
        blogpostsNextPage: action.payload.nextPage,
      };
    }

    default:
      return state;
  }
};
