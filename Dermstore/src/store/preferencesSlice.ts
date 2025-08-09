import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type PreferencesState = {
  favoriteCategory: string;
};

const initialState: PreferencesState = {
  favoriteCategory: 'Skincare',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setFavoriteCategory: (state, action: PayloadAction<string>) => {
      state.favoriteCategory = action.payload;
    },
  },
});

export const { setFavoriteCategory } = preferencesSlice.actions;
export default preferencesSlice.reducer;
