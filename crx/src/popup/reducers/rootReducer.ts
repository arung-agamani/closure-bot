import { combineReducers } from 'redux';

import pageReducer from './pageReducer';

const rootReducer = combineReducers({
  page: pageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
