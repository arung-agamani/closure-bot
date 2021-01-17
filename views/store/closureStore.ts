import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import {
  ReduxDiscordState,
  ReduxDiscordAction,
  ReduxDiscordDispatch,
  IDiscordUser,
} from '../interfaces/ReduxTypes';

const store: Store<ReduxDiscordState, ReduxDiscordAction> & {
  dispatch: ReduxDiscordDispatch;
} = createStore(reducer, applyMiddleware(thunk));

export const RootState = (state: ReduxDiscordState): ReduxDiscordState => state;
export const DiscordState = (state: ReduxDiscordState): IDiscordUser =>
  state.user;

export default store;
