import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  IndianRupee,
  Wrench,
  Package,
  Users,
  Calendar,
  Download,
  BarChart3,
  Award,
  Info
} from 'lucide-react';
import MetricCard from '../../components/common/MetricCard';
import { useApp } from '../../context/AppContext';
import { computeSalesAnalytics } from '../../utils/salesAnalytics';

export default function SalesAnalyticsPage() {
  const { serviceRecords, repairRecords, jobCardsList } = useApp();
  const [periodFilter, setPeriodFilter] = useState('monthly'); // 'daily' | 'weekly' | 'monthly' | 'yearly'
  const [dateRange, setDateRange] = useState('Last 6 Months');
  const [toastMessage, setToastMessage] = useState('');

  const analytics = useMemo(
    () => computeSalesAnalytics({ serviceRecords, repairRecords, jobCardsList }),
    [serviceRecords, repairRecords, jobCardsList]
  );

  const { summary, monthlyComparison, topSellingServices, topSellingParts } = analytics;

  const activeTotalSales = useMemo(() => {
    if (periodFilter === 'daily') return summary.dailySales;
    if (periodFilter === 'weekly') return summary.weeklySales;
    if (periodFilter === 'yearly') return summary.yearlySales;
    return summary.monthlySales;
  }, [periodFilter, summary]);

  const serviceShare = summary.totalRevenue > 0 ? Math.round((summary.serviceRevenue / summary.totalRevenue) * 100) : 0;
  const partsShare = summary.totalRevenue > 0 ? Math.round((summary.sparePartsRevenue / summary.totalRevenue) * 100) : 0;
  const labourShare = summary.totalRevenue > 0 ? Math.max(0, 100 - serviceShare - partsShare) : 0;

  const maxMonthlyTotal = Math.max(...monthlyComparison.map(m => m.total), 1);

  const handleExportSummary = () => {
    const csvRows = [
      ['Month', 'Service Revenue (INR)', 'Spare Parts Revenue (INR)', 'Labour Revenue (INR)', 'Total Sales (INR)'],
      ...monthlyComparison.map(m => [m.month, m.service, m.parts, m.labour, m.total])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `sales-analytics-live-${periodFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage('Live sales summary exported as CSV.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', background: '#101828', color: '#fff',
          padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, zIndex: 9999,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Live Data Notice */}
      <div style={{
        background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px',
        padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#065f46' }}>
          <Info size={16} />
          <span>
            <strong>Live Workshop Revenue:</strong> Calculated from {summary.transactionCount} deduplicated service, repair, and completed job records (Total Recorded: ₹{summary.totalRevenue.toLocaleString()}).
          </span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, background: '#d1fae5', color: '#047857', padding: '3px 10px', borderRadius: '9999px' }}>
          LIVE CALCULATED
        </span>
      </div>

      {/* Filters & Export Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
              <button
                key={period}
                type="button"
                className={`tab-pill ${periodFilter === period ? 'active' : ''}`}
                onClick={() => setPeriodFilter(period)}
                style={{ textTransform: 'capitalize' }}
              >
                {period} Sales
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px 12px', fontSize: '12.5px', color: '#334155' }}>
              <Calendar size={14} color="#356DF3" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#0f172a', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Apr 2026 - Sep 2026">Apr 2026 - Sep 2026</option>
                <option value="Jan 2026 - Jun 2026">Jan 2026 - Jun 2026</option>
                <option value="FY 2025 - 2026">FY 2025 - 2026</option>
              </select>
            </div>
            <button type="button" className="btn-primary btn-sm" onClick={handleExportSummary}>
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* 4 Period Summary KPIs */}
      <div className="metrics-row">
        <MetricCard
          title="Daily Sales (Live)"
          value={`₹${summary.dailySales.toLocaleString()}`}
          icon={IndianRupee}
          color="blue"
          trend="Today"
          trendType="up"
          subtitle="Today's completed intake"
        />
        <MetricCard
          title="Weekly Sales (Live)"
          value={`₹${summary.weeklySales.toLocaleString()}`}
          icon={TrendingUp}
          color="green"
          trend="7 Days"
          trendType="up"
          subtitle="Last 7 days"
        />
        <MetricCard
          title="Monthly Sales (Live)"
          value={`₹${summary.monthlySales.toLocaleString()}`}
          icon={BarChart3}
          color="amber"
          trend="This Month"
          trendType="up"
          subtitle={`Active period: ₹${activeTotalSales.toLocaleString()}`}
        />
        <MetricCard
          title="Yearly Sales (Live)"
          value={`₹${(summary.yearlySales / 100000).toFixed(2)}L`}
          icon={Award}
          color="info"
          trend="YTD"
          trendType="neutral"
          subtitle={`₹${summary.yearlySales.toLocaleString()} (All-time: ₹${summary.totalRevenue.toLocaleString()})`}
        />
      </div>

      {/* Revenue Split Row: Service vs Spare Parts vs Labour */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Service Revenue (All Recorded)</span>
            <Wrench size={18} color="#356DF3" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#101828' }}>
            ₹{summary.serviceRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
            {serviceShare}% of ₹{summary.totalRevenue.toLocaleString()} total
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Spare Parts Revenue (All Recorded)</span>
            <Package size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#101828' }}>
            ₹{summary.sparePartsRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600, marginTop: '4px' }}>
            {partsShare}% of total revenue
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Labour Revenue (All Recorded)</span>
            <Users size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#101828' }}>
            ₹{summary.labourRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#356DF3', fontWeight: 600, marginTop: '4px' }}>
            {labourShare}% of total revenue
          </div>
        </div>
      </div>

      {/* Sales Comparison Chart (Monthly Stacked Bars) */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div className="card-title">
            <BarChart3 size={18} color="#356DF3" />
            <span>Monthly Sales Comparison ({dateRange})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#356DF3' }} /> Service
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#f59e0b' }} /> Spare Parts
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981' }} /> Labour
            </span>
          </div>
        </div>

        <div className="card-body" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', alignItems: 'end', height: '220px', paddingTop: '20px' }}>
            {monthlyComparison.map((item) => {
              const serviceH = Math.round((item.service / maxMonthlyTotal) * 165);
              const partsH = Math.round((item.parts / maxMonthlyTotal) * 165);
              const labourH = Math.round((item.labour / maxMonthlyTotal) * 165);
              return (
                <div key={item.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>
                    ₹{(item.total / 1000).toFixed(0)}k
                  </span>
                  <div style={{ width: '100%', maxWidth: '46px', display: 'flex', flexDirection: 'column-reverse', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(15,23,42,0.08)' }}>
                    <div style={{ height: `${serviceH}px`, background: '#356DF3' }} title={`Service: ₹${item.service.toLocaleString()}`} />
                    <div style={{ height: `${partsH}px`, background: '#f59e0b' }} title={`Spare Parts: ₹${item.parts.toLocaleString()}`} />
                    <div style={{ height: `${labourH}px`, background: '#10b981' }} title={`Labour: ₹${item.labour.toLocaleString()}`} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Selling Services & Top Selling Spare Parts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Wrench size={18} color="#356DF3" />
              <span>Top-Selling Services (Live)</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topSellingServices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>
                No completed service records found yet.
              </div>
            ) : (
              topSellingServices.map((srv) => (
                <div key={srv.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <strong style={{ color: '#0f172a' }}>{srv.name}</strong>
                    <span style={{ color: '#356DF3', fontWeight: 700 }}>₹{srv.revenue.toLocaleString()} ({srv.count} jobs)</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, srv.share)}%`, maxWidth: '100%', height: '100%', background: '#356DF3', borderRadius: '9999px' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Package size={18} color="#f59e0b" />
              <span>Top-Selling Spare Parts (Live)</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>SKU</th>
                    <th>Units</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingParts.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>
                        No spare parts sales recorded yet.
                      </td>
                    </tr>
                  ) : (
                    topSellingParts.map((part) => (
                      <tr key={`${part.name}-${part.sku}`}>
                        <td><strong style={{ fontSize: '13px' }}>{part.name}</strong></td>
                        <td><code style={{ fontSize: '11.5px', color: '#64748b' }}>{part.sku}</code></td>
                        <td>{part.unitsSold}</td>
                        <td><strong style={{ color: '#10b981' }}>₹{part.revenue.toLocaleString()}</strong></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
