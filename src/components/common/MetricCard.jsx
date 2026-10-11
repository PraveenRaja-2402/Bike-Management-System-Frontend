import React from 'react';

export default function MetricCard({ title, value, icon: Icon, color = 'blue', subtitle, onClick }) {
  return (
    <div className={`metric-card metric-${color} ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <div className="metric-icon-wrap">
        {Icon && <Icon className="metric-icon" size={24} />}
      </div>
      <div className="metric-content">
        <span className="metric-title">{title}</span>
        <div className="metric-value-row">
          <span className="metric-value">{value}</span>
          {subtitle && <span className="metric-subtitle">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
