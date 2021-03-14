import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './reducers/themeSlice';
import boardReducer from './reducers/boardSlice';

export default configureStore({
  reducer: {
     theme: themeReducer,
     board: boardReducer,
  },
});
