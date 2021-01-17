import * as actionTypes from './actionTypes';
import {
  ReduxDiscordAction,
  ReduxDiscordState,
} from '../interfaces/ReduxTypes';

const initialState = {
  user: null,
};

const reducer = (
  state: ReduxDiscordState = initialState,
  action: ReduxDiscordAction
): ReduxDiscordState => {
  switch (action.type) {
    case actionTypes.ADD_DISCORD_USERID:
      return {
        ...state,
        user: action.payload,
      };
    case actionTypes.REMOVE_DISCORD_USERID:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
