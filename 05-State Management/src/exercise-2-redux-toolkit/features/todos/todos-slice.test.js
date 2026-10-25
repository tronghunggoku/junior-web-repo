import { describe, expect, it } from 'vitest';
import { makeAppStore } from '../../store/app-store.js';
import todosReducer, {
  completedCleared,
  fetchTodos,
  filterChanged,
  initialState,
  selectTodoStats,
  selectVisibleTodos,
  todoAdded,
  todoEdited,
  todoRemoved,
  todoToggled,
} from './todos-slice.js';

const apiTodos = [
  { id: 1, todo: 'Học Redux', completed: false, userId: 1 },
  { id: 2, todo: 'Học Zustand', completed: true, userId: 1 },
];

describe('todos reducer', () => {
  it('fetchTodos pending → fulfilled cập nhật status và dữ liệu', () => {
    let state = todosReducer(initialState, fetchTodos.pending('req-1'));
    expect(state.status).toBe('loading');

    state = todosReducer(state, fetchTodos.fulfilled(apiTodos, 'req-1'));
    expect(state.status).toBe('succeeded');
    expect(state.ids).toEqual([1, 2]);
  });

  it('fetchTodos rejected lưu lỗi', () => {
    const state = todosReducer(initialState, fetchTodos.rejected(new Error('HTTP 500'), 'req-1'));
    expect(state.status).toBe('failed');
    expect(state.error).toBe('HTTP 500');
  });

  it('todoAdded trim text, sinh id và đứng đầu danh sách', () => {
    let state = todosReducer(initialState, fetchTodos.fulfilled(apiTodos, 'req-1'));
    state = todosReducer(state, todoAdded('  Viết test  '));
    const newId = state.ids[0];
    expect(typeof newId).toBe('string');
    expect(state.entities[newId]).toMatchObject({ todo: 'Viết test', completed: false });
  });

  it('toggle / edit / remove / clear completed', () => {
    let state = todosReducer(initialState, fetchTodos.fulfilled(apiTodos, 'req-1'));
    state = todosReducer(state, todoToggled(1));
    expect(state.entities[1].completed).toBe(true);

    state = todosReducer(state, todoEdited(1, '   '));
    expect(state.entities[1].todo).toBe('Học Redux'); // text rỗng bị bỏ qua
    state = todosReducer(state, todoEdited(1, 'Học RTK'));
    expect(state.entities[1].todo).toBe('Học RTK');

    state = todosReducer(state, completedCleared());
    expect(state.ids).toEqual([]);

    state = todosReducer(state, todoAdded('A'));
    state = todosReducer(state, todoRemoved(state.ids[0]));
    expect(state.ids).toEqual([]);
  });
});

describe('selectors trên store thật', () => {
  it('lọc theo filter và thống kê; filter không hợp lệ bị bỏ qua', () => {
    const store = makeAppStore();
    store.dispatch(fetchTodos.fulfilled(apiTodos, 'req-1'));

    store.dispatch(filterChanged('completed'));
    expect(selectVisibleTodos(store.getState()).map((t) => t.id)).toEqual([2]);

    store.dispatch(filterChanged('khong-hop-le'));
    expect(store.getState().todos.filter).toBe('completed');

    expect(selectTodoStats(store.getState())).toEqual({ total: 2, completed: 1, active: 1 });
  });

  it('selector memo trả cùng reference khi state không đổi', () => {
    const store = makeAppStore();
    store.dispatch(fetchTodos.fulfilled(apiTodos, 'req-1'));
    expect(selectVisibleTodos(store.getState())).toBe(selectVisibleTodos(store.getState()));
  });
});
