import { createSlice } from '@reduxjs/toolkit';
import * as themeTypes from '../../constants/themeTypes';
import themes from '../../constants/themes';

const standartTheme = themes[themeTypes.STANDART];
const customTheme = themes[localStorage.getItem('theme')];

const themeSlice = createSlice({
    name: 'theme',
    initialState: customTheme || standartTheme ,
    reducers: {
        setTheme: (state, { payload }) => payload
    }
});

export const { setTheme } = themeSlice.actions;
export default  themeSlice.reducer;