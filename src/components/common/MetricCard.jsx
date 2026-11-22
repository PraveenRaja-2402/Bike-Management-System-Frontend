import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  subtitle, 
  trend,
  trendType = 'up',
  onClick 
}) {
  return (
    <div 
      className={`metric-card metric-${color} ${onClick ? 'clickable' : ''}`} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="metric-card-top-bar" />
      <div className="metric-icon-wrap">
        {Icon && <Icon className="metric-icon" size={22} />}
        <span className="metric-icon-glow" />
      </div>

      <div className="metric-content">
        <div className="metric-header-row">
          <span className="metric-title">{title}</span>
          {trend && (
            <span className={`metric-trend-pill trend-${trendType}`}>
              {trendType === 'up' && <ArrowUpRight size={11} />}
              {trendType === 'down' && <ArrowDownRight size={11} />}
              {trendType === 'warning' && <TrendingUp size={11} />}
              <span>{trend}</span>
            </span>
          )}
        </div>

        <div className="metric-value-row">
          <span className="metric-value">{value}</span>
          {subtitle && <span className="metric-subtitle">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}

