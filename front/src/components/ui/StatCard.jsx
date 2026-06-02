export default function StatCard({ icon, value, label, trend, trendDir, color, delay }) {
  return (
    <div
      className={`stat-card animate-fade-in-up stagger-${delay || 1}`}
      style={{ '--stat-color': color || 'var(--color-primary)' }}
    >
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: `${color || 'var(--color-primary)'}18` }}>
          {icon}
        </div>
        {trend && (
          <span className={`stat-card-trend ${trendDir || 'up'}`}>
            {trendDir === 'down' ? '↓' : '↑'} {trend}
          </span>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
