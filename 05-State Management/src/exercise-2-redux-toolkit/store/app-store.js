import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer.js';

/**
 * Factory tạo store — app dùng 1 instance, test tạo instance mới với
 * preloadedState riêng để các test không ảnh hưởng nhau.
 */
export function makeAppStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: import.meta.env?.DEV ?? false,
  });
}

export const appStore = makeAppStore();
