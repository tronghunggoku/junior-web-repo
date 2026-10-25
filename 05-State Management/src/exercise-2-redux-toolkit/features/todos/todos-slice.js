import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
} from '@reduxjs/toolkit';
import { fetchDummyJson } from '../../../shared/api/dummyjson-client.js';

/**
 * Todos slice hoàn chỉnh với Redux Toolkit:
 * - createEntityAdapter: chuẩn hoá dữ liệu `{ ids, entities }`, CRUD có sẵn
 * - createAsyncThunk: gọi API thật, có trạng thái idle/loading/succeeded/failed
 * - prepare callback: sinh id + validate input trước khi vào reducer
 * - createSelector: selector memo cho dữ liệu dẫn xuất (lọc, thống kê)
 */
export const TODO_FILTERS = ['all', 'active', 'completed'];

const todosAdapter = createEntityAdapter({
  // Todo mới (id string) lên đầu, todo từ API (id number) giữ thứ tự gốc
  sortComparer: (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0),
});

export const initialState = todosAdapter.getInitialState({
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filter: 'all',
});

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (limit = 10, { signal }) => {
    const data = await fetchDummyJson(`/todos?limit=${limit}`, { signal });
    return data.todos;
  },
  {
    // Chặn dispatch trùng khi đang loading (vd: double click, StrictMode)
    condition: (_limit, { getState }) => getState().todos.status !== 'loading',
  },
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded: {
      reducer: todosAdapter.addOne,
      prepare: (text) => ({
        payload: { id: nanoid(), todo: text.trim(), completed: false, createdAt: Date.now() },
      }),
    },
    // Immer cho phép "mutate" trực tiếp — RTK tự chuyển thành immutable update
    todoToggled(state, action) {
      const todo = state.entities[action.payload];
      if (todo) todo.completed = !todo.completed;
    },
    todoEdited: {
      reducer(state, action) {
        const { id, text } = action.payload;
        if (!text) return; // không cho phép todo rỗng
        todosAdapter.updateOne(state, { id, changes: { todo: text } });
      },
      prepare: (id, text) => ({ payload: { id, text: text.trim() } }),
    },
    todoRemoved: todosAdapter.removeOne,
    completedCleared(state) {
      const completedIds = state.ids.filter((id) => state.entities[id].completed);
      todosAdapter.removeMany(state, completedIds);
    },
    filterChanged(state, action) {
      if (TODO_FILTERS.includes(action.payload)) state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // upsert để không xoá các todo người dùng đã tự thêm
        todosAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.error.message ?? 'Không tải được todos';
      });
  },
});

export const { todoAdded, todoToggled, todoEdited, todoRemoved, completedCleared, filterChanged } =
  todosSlice.actions;

export default todosSlice.reducer;

// ---------- Selectors ----------
export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectTotal: selectTodoTotal,
} = todosAdapter.getSelectors((rootState) => rootState.todos);

export const selectTodoFilter = (rootState) => rootState.todos.filter;
export const selectTodosStatus = (rootState) => rootState.todos.status;
export const selectTodosError = (rootState) => rootState.todos.error;

export const selectVisibleTodos = createSelector(
  [selectAllTodos, selectTodoFilter],
  (todos, filter) => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed);
    if (filter === 'completed') return todos.filter((todo) => todo.completed);
    return todos;
  },
);

export const selectTodoStats = createSelector([selectAllTodos], (todos) => {
  const completed = todos.filter((todo) => todo.completed).length;
  return { total: todos.length, completed, active: todos.length - completed };
});
