import { combineReducers } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todos-slice.js';

/**
 * Root reducer — điểm DUY NHẤT đăng ký các feature module.
 * Thêm module mới (auth, orders, ...) = thêm 1 dòng tại đây; mỗi module tự
 * quản lý slice/selectors/thunks trong thư mục `features/<tên-module>/`.
 */
export const rootReducer = combineReducers({
  todos: todosReducer,
});
