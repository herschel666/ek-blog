import { api, MEDIA_API_URL } from './api';

const ADD_MEDIA_ELEMENTS = 'app::ADD_MEDIA_ELEMENTS';

const addMediaElements = (payload) => ({
  type: ADD_MEDIA_ELEMENTS,
  payload,
});

const initialState = {
  mediaElements: [],
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

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
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
