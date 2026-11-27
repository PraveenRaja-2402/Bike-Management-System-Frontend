import React, { useState, useMemo } from 'react';
import { Star, MessageSquare, TrendingUp, Award, Info, Wrench } from 'lucide-react';
import MetricCard from '../../components/common/MetricCard';
import { mockCustomerRatings } from '../../data/mockData';

export default function CustomerRatingsPage() {
  const [starFilter, setStarFilter] = useState('All');
  const { overallRating, totalReviews, distribution, serviceWiseRatings, monthlyTrend, feedbackList } = mockCustomerRatings;

  const filteredFeedback = useMemo(() => {
    if (starFilter === 'All') return feedbackList;
    return feedbackList.filter(f => f.rating === Number(starFilter));
  }, [feedbackList, starFilter]);

  const renderStars = (count) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={14}
          fill={n <= count ? '#f59e0b' : 'none'}
          color={n <= count ? '#f59e0b' : '#cbd5e1'}
        />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sample Data Banner */}
      <div style={{
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px',
        padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1e40af' }}>
          <Info size={16} />
          <span>
            <strong>Sample Customer Feedback:</strong> Ratings, service-wise scores, and reviews below are sample placeholders until connected to your backend feedback API.
          </span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: '9999px' }}>
          SAMPLE DATA
        </span>
      </div>

      {/* KPI Row */}
      <div className="metrics-row">
        <MetricCard
          title="Overall Customer Rating"
          value={`${overallRating} / 5.0`}
          icon={Star}
          color="amber"
          trend="94% Positive"
          trendType="up"
          subtitle={`Based on ${totalReviews} sample reviews`}
        />
        <MetricCard
          title="5-Star Reviews"
          value={distribution[0].count}
          icon={Award}
          color="green"
          trend={`${distribution[0].percentage}% share`}
          trendType="up"
          subtitle="Highest satisfaction tier"
        />
        <MetricCard
          title="Top Rated Service"
          value="4.9 ★"
          icon={Wrench}
          color="blue"
          trend="Engine Oil & Filter"
          trendType="up"
          subtitle="44 verified sample ratings"
        />
        <MetricCard
          title="Monthly Satisfaction"
          value="4.8 ★"
          icon={TrendingUp}
          color="info"
          trend="+0.4 since Apr"
          trendType="up"
          subtitle="September trend"
        />
      </div>

      {/* 5-Star Distribution + Monthly Satisfaction Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Star size={18} color="#f59e0b" />
              <span>Five-Star Rating Distribution</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {distribution.map((row) => (
              <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '52px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {row.stars} Star
                </span>
                <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${row.percentage}%`,
                      height: '100%',
                      background: row.stars >= 4 ? '#10b981' : row.stars === 3 ? '#f59e0b' : '#ef4444',
                      borderRadius: '9999px'
                    }}
                  />
                </div>
                <span style={{ width: '74px', textAlign: 'right', fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                  {row.count} ({row.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} color="#356DF3" />
              <span>Monthly Satisfaction Trend</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', alignItems: 'end', height: '185px' }}>
              {monthlyTrend.map((m) => {
                const h = Math.round((m.rating / 5) * 140);
                return (
                  <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{m.rating}★</span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '38px',
                        height: `${h}px`,
                        background: 'linear-gradient(180deg, #356DF3 0%, #60a5fa 100%)',
                        borderRadius: '8px 8px 4px 4px'
                      }}
                      title={`${m.month}: ${m.rating}/5 (${m.reviews} reviews)`}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Service-Wise Ratings */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Wrench size={18} color="#356DF3" />
            <span>Service-Wise Customer Ratings (Sample)</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {serviceWiseRatings.map(srv => (
            <div key={srv.service} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{srv.service}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#356DF3' }}>{srv.rating} ★</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{srv.reviews} reviews</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Customer Feedback List */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div className="card-title">
            <MessageSquare size={18} color="#356DF3" />
            <span>Individual Customer Feedback (Sample Entries)</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', '5', '4', '3'].map(val => (
              <button
                key={val}
                type="button"
                className={`tab-pill ${starFilter === val ? 'active' : ''}`}
                onClick={() => setStarFilter(val)}
              >
                {val === 'All' ? 'All Ratings' : `${val} Stars`}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFeedback.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '36px 20px',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              color: '#64748b'
            }}>
              <MessageSquare size={28} color="#94a3b8" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                No customer feedback found
              </div>
              <div style={{ fontSize: '12.5px', marginBottom: '12px' }}>
                No reviews match the selected "{starFilter === 'All' ? 'All Ratings' : `${starFilter} Stars`}" filter.
              </div>
              {starFilter !== 'All' && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStarFilter('All')}
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  Show All Ratings
                </button>
              )}
            </div>
          ) : (
            filteredFeedback.map(item => (
              <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{item.customerName}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>
                      {item.bikeModel} ({item.regNo}) • {item.serviceType}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {renderStars(item.rating)}
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>{item.date}</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>{item.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
