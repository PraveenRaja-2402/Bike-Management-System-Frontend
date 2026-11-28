import React, { useState, useMemo } from 'react';
import { Activity, AlertTriangle, Calendar, Gauge, Settings2, CheckCircle2, Info, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import MetricCard from '../../components/common/MetricCard';
import StatusBadge from '../../components/common/StatusBadge';

export default function ServicePredictionPage() {
  const { bikesList, serviceRecords, serviceIntervals, updateServiceIntervals } = useApp();
  const [intervalsForm, setIntervalsForm] = useState(serviceIntervals);
  const [showConfig, setShowConfig] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const predictions = useMemo(() => {
    const today = new Date();
    const engineOilLimit = parseInt(serviceIntervals.engineOilKm, 10) || 3000;
    const brakeOilLimit = parseInt(serviceIntervals.brakeInspectionKm, 10) || 3000;
    const airFilterLimit = parseInt(serviceIntervals.airFilterKm, 10) || 6000;
    const chainLimit = parseInt(serviceIntervals.chainMaintenanceKm, 10) || 500;
    const batteryCheckMonths = parseInt(serviceIntervals.batteryCheckMonths, 10) || 6;
    const tyreLimit = parseInt(serviceIntervals.tyreReplacementKm, 10) || 12000;
    const clutchLimit = parseInt(serviceIntervals.clutchMaintenanceKm, 10) || 10000;

    return bikesList.map((bike) => {
      const bikeHistory = serviceRecords
        .filter(s => s.regNo === bike.regNo)
        .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

      const latestService = bikeHistory[0];
      const lastOdo = parseInt(bike.lastServiceKm, 10) || (latestService ? parseInt(latestService.odometerReading, 10) : 0) || 0;
      const curOdo = parseInt(bike.currentKm, 10) || lastOdo;
      const kmSinceLast = Math.max(0, curOdo - lastOdo);

      const nextTargetKm = parseInt(bike.nextServiceKm, 10) || (lastOdo + engineOilLimit);
      const remainingKm = nextTargetKm - curOdo;

      // Estimate predicted date based on ~35 km/day sample average usage
      const estDays = remainingKm > 0 ? Math.max(1, Math.round(remainingKm / 35)) : 0;
      const predictedDateObj = new Date(today);
      predictedDateObj.setDate(today.getDate() + estDays);
      const predictedDateStr = bike.nextServiceDate || predictedDateObj.toISOString().split('T')[0];

      const lastDateStr = latestService?.serviceDate || bike.lastServiceDate;
      const lastDate = lastDateStr ? new Date(lastDateStr) : null;
      const monthsSinceService = lastDate && Number.isFinite(lastDate.getTime())
        ? Math.max(0, (today.getFullYear() - lastDate.getFullYear()) * 12 + (today.getMonth() - lastDate.getMonth()))
        : 0;

      const componentsDue = [];
      if (kmSinceLast >= engineOilLimit * 0.85) componentsDue.push('Engine Oil');
      if (kmSinceLast >= chainLimit * 0.85) componentsDue.push('Chain Clean & Lube');
      if (kmSinceLast >= airFilterLimit * 0.8) componentsDue.push('Air Filter');
      if (kmSinceLast >= brakeOilLimit * 0.8) componentsDue.push('Brake Oil & Pads');
      if (monthsSinceService >= Math.max(1, batteryCheckMonths - 1)) componentsDue.push('Battery Inspection');
      if (curOdo >= tyreLimit * 0.85 || kmSinceLast >= tyreLimit * 0.8) componentsDue.push('Tyre Tread & Pressure');
      if (curOdo >= clutchLimit * 0.85 || kmSinceLast >= clutchLimit * 0.8) componentsDue.push('Clutch Plate & Cable');
      if (componentsDue.length === 0 && remainingKm <= 500) componentsDue.push('General Inspection');

      const urgency = remainingKm <= 0 ? 'Overdue' : remainingKm <= 500 ? 'Due Soon' : 'Healthy';

      return {
        ...bike,
        lastOdo,
        curOdo,
        kmSinceLast,
        remainingKm,
        predictedDateStr,
        lastReplacementDate: latestService?.serviceDate || bike.lastServiceDate || 'Not recorded',
        componentsDue,
        urgency
      };
    });
  }, [bikesList, serviceRecords, serviceIntervals]);

  const overdueCount = predictions.filter(p => p.urgency === 'Overdue').length;
  const dueSoonCount = predictions.filter(p => p.urgency === 'Due Soon').length;
  const healthyCount = predictions.filter(p => p.urgency === 'Healthy').length;

  const handleSaveIntervals = (e) => {
    e.preventDefault();
    updateServiceIntervals(intervalsForm);
    setShowConfig(false);
    setToastMessage('Service prediction intervals updated successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', background: '#101828', color: '#fff',
          padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          <CheckCircle2 size={16} color="#12b76a" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Estimate Disclaimer Banner */}
      <div style={{
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px',
        padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1e40af' }}>
          <Info size={16} />
          <span>
            <strong>Predictive Estimates (Sample Model):</strong> Next service dates and component wear alerts are estimates derived from available odometer logs, service history, and configured intervals.
          </span>
        </div>
        <button
          type="button"
          className="btn-primary btn-sm"
          onClick={() => {
            setIntervalsForm(serviceIntervals);
            setShowConfig(!showConfig);
          }}
        >
          <Settings2 size={14} /> {showConfig ? 'Hide Interval Config' : 'Configure Intervals'}
        </button>
      </div>

      {/* Configurable Service Intervals Panel */}
      {showConfig && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Settings2 size={18} color="#356DF3" />
              <span>Configure Maintenance Prediction Intervals (KM & Days)</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '20px 24px' }}>
            <form onSubmit={handleSaveIntervals}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Engine Oil Interval (km)</label>
                  <input
                    type="number"
                    className="form-input no-left-icon"
                    value={intervalsForm.engineOilKm}
                    onChange={(e) => setIntervalsForm({ ...intervalsForm, engineOilKm: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Air Filter Interval (km)</label>
                  <input
                    type="number"
                    className="form-input no-left-icon"
                    value={intervalsForm.airFilterKm}
                    onChange={(e) => setIntervalsForm({ ...intervalsForm, airFilterKm: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Brake Inspection Interval (km)</label>
                  <input
                    type="number"
                    className="form-input no-left-icon"
                    value={intervalsForm.brakeInspectionKm ?? 3000}
                    onChange={(e) => setIntervalsForm({ ...intervalsForm, brakeInspectionKm: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chain Maintenance Interval (km)</label>
                  <input
                    type="number"
                    className="form-input no-left-icon"
                    value={intervalsForm.chainMaintenanceKm ?? 500}
                    onChange={(e) => setIntervalsForm({ ...intervalsForm, chainMaintenanceKm: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Battery Check Interval (months)</label>
                  <input
                    type="number"
                    className="form-input no-left-icon"
                    value={intervalsForm.batteryCheckMonths ?? 6}
                    onChange={(e) => setIntervalsForm({ ...intervalsForm, batteryCheckMonths: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-cancel" onClick={() => setShowConfig(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Prediction Intervals</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prediction Summary KPIs */}
      <div className="metrics-row">
        <MetricCard
          title="Overdue Alerts"
          value={overdueCount}
          icon={AlertTriangle}
          color="red"
          trend="Immediate Service"
          trendType="warning"
          subtitle="Exceeded predicted KM"
        />
        <MetricCard
          title="Upcoming Maintenance"
          value={dueSoonCount}
          icon={Calendar}
          color="amber"
          trend="Within 500 km"
          trendType="warning"
          subtitle="Schedule reminder"
        />
        <MetricCard
          title="Healthy Fleet"
          value={healthyCount}
          icon={CheckCircle2}
          color="green"
          trend="On Track"
          trendType="up"
          subtitle="Within safe intervals"
        />
        <MetricCard
          title="Oil Benchmark"
          value={`${(serviceIntervals.engineOilKm || 3000).toLocaleString()} km`}
          icon={Gauge}
          color="blue"
          trend="Configurable"
          trendType="neutral"
          subtitle="Primary service cycle"
        />
      </div>

      {/* Prediction Table */}
      <div className="table-card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="card-title">
            <Activity size={18} color="#356DF3" />
            <span>Vehicle Maintenance Forecasts & Component Due Alerts</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Estimates based on sample service & odometer data</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Vehicle & Owner</th>
                <th>Last Service Odo / Date</th>
                <th>Current Odo</th>
                <th>Est. Remaining KM</th>
                <th>Predicted Next Date</th>
                <th>Components Due (Estimate)</th>
                <th>Alert Status</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.regNo}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{item.brand} {item.model} • {item.ownerName || item.customer}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.lastOdo.toLocaleString()} km</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{item.lastReplacementDate}</div>
                  </td>
                  <td><strong>{item.curOdo.toLocaleString()} km</strong></td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: item.remainingKm <= 0 ? '#dc2626' : item.remainingKm <= 500 ? '#d97706' : '#059669'
                    }}>
                      {item.remainingKm <= 0 ? `${Math.abs(item.remainingKm).toLocaleString()} km overdue` : `${item.remainingKm.toLocaleString()} km left`}
                    </span>
                  </td>
                  <td><strong style={{ color: '#356DF3' }}>{item.predictedDateStr}</strong></td>
                  <td>
                    {item.componentsDue.length > 0 ? (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {item.componentsDue.map(comp => (
                          <span key={comp} style={{ fontSize: '11px', fontWeight: 600, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px' }}>
                            <Wrench size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />
                            {comp}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>No immediate wear</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={item.urgency === 'Overdue' ? 'Overdue' : item.urgency === 'Due Soon' ? 'Pending' : 'Completed'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
