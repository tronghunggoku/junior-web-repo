import { Provider } from 'react-redux';
import { appStore } from './store/app-store.js';
import { TodosPanel } from './features/todos/todos-panel.jsx';

/** Bài 2: 1 slice RTK hoàn chỉnh (todos) trong store chia module. */
export function ReduxTodosDemo() {
  return (
    <Provider store={appStore}>
      <section aria-labelledby="rtk-demo-title">
        <header className="section-header">
          <h2 id="rtk-demo-title">Bài 2 — Redux Toolkit: todos slice hoàn chỉnh</h2>
          <p className="muted">
            Mở Redux DevTools để xem action: todos/fetchTodos/pending → fulfilled, todoAdded…
          </p>
        </header>
        <TodosPanel />
      </section>
    </Provider>
  );
}
