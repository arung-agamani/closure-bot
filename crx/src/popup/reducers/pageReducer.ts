/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';

export interface PageState {
  name: string;
}

export const pageInitialState: PageState = {
  name: 'AK',
};

export const counterSlice = createSlice({
  name: 'page',
  initialState: pageInitialState,
  reducers: {
    setPage: (state, { payload }: PayloadAction<string>): void => {
      state.name = payload;
    },
    resetPageState: () => pageInitialState,
  },
});

export const { setPage, resetPageState } = counterSlice.actions;

export const switchPage = (name: string) => (dispatch): void => {
  dispatch(setPage(name));
};

export const page = (state: RootState): PageState => state.page;

export default counterSlice.reducer;
