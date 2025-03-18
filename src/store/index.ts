
// Store configuration
import { configureStore } from '@reduxjs/toolkit';
import fileExplorerSlice from './fileExplorerSlice';

export const store = configureStore({
  reducer: {
    fileExplorer: fileExplorerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;