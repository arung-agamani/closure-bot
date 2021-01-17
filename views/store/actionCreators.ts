import * as actionTypes from './actionTypes';
import { IDiscordUser } from '../interfaces/ReduxTypes';

export function addUserData(userData: IDiscordUser) {
  const action = {
    type: actionTypes.ADD_DISCORD_USERID,
    payload: userData,
  };
  return action;
}

export default null;
