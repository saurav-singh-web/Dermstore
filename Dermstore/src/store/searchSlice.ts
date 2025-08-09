// store/searchSlice.ts
import { createSlice } from '@reduxjs/toolkit';

type SearchState = { query: string };

const initialState: SearchState = { query: '' };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: { payload: string }) => {
      state.query = action.payload;
    },
    clearSearchQuery: (state) => {
      state.query = '';
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
