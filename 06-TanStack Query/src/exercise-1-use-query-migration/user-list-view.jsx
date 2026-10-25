/** UI thuần (presentational) — dùng chung cho bản before/after để so sánh công bằng. */
export function UserListView({ title, users, isLoading, error, isRefreshing, onRefresh }) {
  return (
    <div className="panel user-list">
      <header className="user-list-header">
        <h3>{title}</h3>
        {onRefresh && (
          <button type="button" className="ghost" onClick={onRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Đang làm mới…' : 'Refetch'}
          </button>
        )}
      </header>
      {isLoading && <p className="muted">Đang tải…</p>}
      {error && <p className="error">Lỗi: {error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.image} alt="" width="32" height="32" loading="lazy" />
            <span>
              {user.firstName} {user.lastName}
              <small className="muted"> · {user.company?.title}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
