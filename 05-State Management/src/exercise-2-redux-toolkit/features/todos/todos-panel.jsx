import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TODO_FILTERS,
  completedCleared,
  fetchTodos,
  filterChanged,
  selectTodoFilter,
  selectTodoStats,
  selectTodosError,
  selectTodosStatus,
  selectVisibleTodos,
  todoAdded,
  todoRemoved,
  todoToggled,
} from './todos-slice.js';

const FILTER_LABELS = { all: 'Tất cả', active: 'Chưa xong', completed: 'Đã xong' };

export function TodosPanel() {
  const dispatch = useDispatch();
  const todos = useSelector(selectVisibleTodos);
  const stats = useSelector(selectTodoStats);
  const filter = useSelector(selectTodoFilter);
  const status = useSelector(selectTodosStatus);
  const error = useSelector(selectTodosError);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchTodos(10));
  }, [status, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    dispatch(todoAdded(draft));
    setDraft('');
  };

  return (
    <div className="panel todos-panel">
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Thêm việc cần làm…"
          aria-label="Nội dung todo"
        />
        <button type="submit">Thêm</button>
      </form>

      <div className="todo-toolbar" role="group" aria-label="Lọc todo">
        {TODO_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            className={value === filter ? '' : 'ghost'}
            aria-pressed={value === filter}
            onClick={() => dispatch(filterChanged(value))}
          >
            {FILTER_LABELS[value]}
          </button>
        ))}
        <span className="muted">
          {stats.active} chưa xong / {stats.total}
        </span>
      </div>

      {status === 'loading' && <p className="muted">Đang tải todos từ API…</p>}
      {status === 'failed' && (
        <p className="error">
          {error}{' '}
          <button type="button" className="ghost" onClick={() => dispatch(fetchTodos(10))}>
            Thử lại
          </button>
        </p>
      )}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch(todoToggled(todo.id))}
              />
              {todo.todo}
            </label>
            <button type="button" className="ghost" onClick={() => dispatch(todoRemoved(todo.id))}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="ghost"
        disabled={stats.completed === 0}
        onClick={() => dispatch(completedCleared())}
      >
        Xoá {stats.completed} việc đã xong
      </button>
    </div>
  );
}
