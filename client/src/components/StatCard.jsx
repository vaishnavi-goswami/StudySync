function StatCard({ icon, value, label, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <h3>{value}</h3>
        <p>{label}</p>

        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </div>
  );
}

export default StatCard;