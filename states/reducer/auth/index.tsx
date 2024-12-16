import {LOADING, TOKEN, ERROR} from './case';

const initialState = {
  token: '',
  loading: false,
  error: null,
};

export const AuthReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TOKEN:
      return {
        ...state,
        token: action.token
      };
    case LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};
