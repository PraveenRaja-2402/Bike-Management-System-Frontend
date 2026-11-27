import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  Bike, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ReportsPage() {
  const { 
    bikesList, 
    serviceRecords, 
    repairRecords, 
    serviceIntervals, 
    branding 
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState('daily'); 
  // 'daily' | 'monthly' | 'bike_history' | 'repairs' | 'upcoming_overdue'

  // Daily report filters
  const [selectedDailyDate, setSelectedDailyDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Monthly report filters
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Individual Bike filter
  const [selectedBikeId, setSelectedBikeId] = useState(() => bikesList[0]?.id || '');
  const [bikeSearchQuery, setBikeSearchQuery] = useState('');

  // 1. Daily Service Report Data
  const dailyReportData = useMemo(() => {
    const services = serviceRecords.filter(s => s.serviceDate === selectedDailyDate);
    const repairs = repairRecords.filter(r => r.repairDate === selectedDailyDate);
    const totalServiceCost = services.reduce((sum, s) => sum + (parseFloat(s.serviceCost) || 0), 0);
    const totalRepairCost = repairs.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);

    return {
      date: selectedDailyDate,
      services,
      repairs,
      serviceCount: services.length,
      repairCount: repairs.length,
      totalRevenue: totalServiceCost + totalRepairCost,
      totalServiceCost,
      totalRepairCost
    };
  }, [serviceRecords, repairRecords, selectedDailyDate]);

  // Weekly Service Report Data (Last 7 Days)
  const weeklyReportData = useMemo(() => {
    const end = new Date(selectedDailyDate || new Date());
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const services = serviceRecords.filter(s => {
      if (!s.serviceDate) return false;
      const d = new Date(s.serviceDate);
      return d >= start && d <= end;
    });

    const repairs = repairRecords.filter(r => {
      if (!r.repairDate) return false;
      const d = new Date(r.repairDate);
      return d >= start && d <= end;
    });

    const totalServiceCost = services.reduce((sum, s) => sum + (parseFloat(s.serviceCost) || 0), 0);
    const totalRepairCost = repairs.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      services,
      repairs,
      serviceCount: services.length,
      repairCount: repairs.length,
      totalRevenue: totalServiceCost + totalRepairCost,
      totalServiceCost,
      totalRepairCost
    };
  }, [serviceRecords, repairRecords, selectedDailyDate]);

  // 2. Monthly Service Report Data
  const monthlyReportData = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const services = serviceRecords.filter(s => {
      if (!s.serviceDate) return false;
      return s.serviceDate.startsWith(`${year}-${month}`);
    });
    const repairs = repairRecords.filter(r => {
      if (!r.repairDate) return false;
      return r.repairDate.startsWith(`${year}-${month}`);
    });

    const totalServiceCost = services.reduce((sum, s) => sum + (parseFloat(s.serviceCost) || 0), 0);
    const totalRepairCost = repairs.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);
    const totalPartsCost = repairs.reduce((sum, r) => {
      const pCost = (r.partsReplaced || []).reduce((pSum, p) => pSum + (parseFloat(p.total) || 0), 0);
      return sum + pCost;
    }, 0);
    const totalLaborCost = repairs.reduce((sum, r) => sum + (parseFloat(r.laborCost) || 0), 0);

    // Grouping by brand
    const brandMap = {};
    services.forEach(s => {
      const bike = bikesList.find(b => b.id === s.bikeId || b.regNo.toUpperCase() === s.regNo.toUpperCase());
      const brand = bike?.brand || 'Other';
      brandMap[brand] = (brandMap[brand] || 0) + 1;
    });

    return {
      monthYear: selectedMonth,
      services,
      repairs,
      totalServices: services.length,
      totalRepairs: repairs.length,
      totalRevenue: totalServiceCost + totalRepairCost,
      totalServiceCost,
      totalRepairCost,
      totalPartsCost,
      totalLaborCost,
      brandBreakdown: brandMap
    };
  }, [serviceRecords, repairRecords, bikesList, selectedMonth]);

  // 3. Individual Bike Service History Data
  const currentSelectedBike = useMemo(() => {
    return bikesList.find(b => b.id === selectedBikeId) || bikesList[0];
  }, [bikesList, selectedBikeId]);

  const bikeHistoryData = useMemo(() => {
    if (!currentSelectedBike) return { services: [], repairs: [], totalSpent: 0 };
    const reg = currentSelectedBike.regNo.toUpperCase();
    const bId = currentSelectedBike.id;

    const services = serviceRecords.filter(s => s.bikeId === bId || s.regNo.toUpperCase() === reg);
    const repairs = repairRecords.filter(r => r.bikeId === bId || r.regNo.toUpperCase() === reg);

    const serviceCost = services.reduce((sum, s) => sum + (parseFloat(s.serviceCost) || 0), 0);
    const repairCost = repairs.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);

    return {
      bike: currentSelectedBike,
      services,
      repairs,
      totalSpent: serviceCost + repairCost,
      serviceCount: services.length,
      repairCount: repairs.length
    };
  }, [currentSelectedBike, serviceRecords, repairRecords]);

  // 4. Repair and Maintenance Report Data
  const repairMaintenanceData = useMemo(() => {
    const totalRepairs = repairRecords.length;
    const totalRepairCost = repairRecords.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);
    const totalPartsCost = repairRecords.reduce((sum, r) => {
      const pCost = (r.partsReplaced || []).reduce((pSum, p) => pSum + (parseFloat(p.total) || 0), 0);
      return sum + pCost;
    }, 0);
    const totalLaborCost = repairRecords.reduce((sum, r) => sum + (parseFloat(r.laborCost) || 0), 0);

    return {
      repairs: repairRecords,
      totalRepairs,
      totalRepairCost,
      totalPartsCost,
      totalLaborCost
    };
  }, [repairRecords]);

  // 5. Upcoming & Overdue Service Report Data
  const upcomingOverdueData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueList = [];
    const upcomingList = [];
    const insuranceList = [];

    bikesList.forEach(bike => {
      const curKm = parseInt(bike.currentKm, 10) || 0;
      const nextKm = parseInt(bike.nextServiceKm, 10) || (curKm + 3000);
      const kmRemaining = nextKm - curKm;

      let daysRemaining = 999;
      if (bike.nextServiceDate) {
        const nextDate = new Date(bike.nextServiceDate);
        nextDate.setHours(0, 0, 0, 0);
        daysRemaining = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
      }

      let insuranceDays = null;
      if (bike.insuranceExpiryDate) {
        const insDate = new Date(bike.insuranceExpiryDate);
        insDate.setHours(0, 0, 0, 0);
        insuranceDays = Math.ceil((insDate - today) / (1000 * 60 * 60 * 24));
      }

      const item = {
        ...bike,
        kmRemaining,
        daysRemaining,
        insuranceDays
      };

      if (kmRemaining <= 0 || daysRemaining < 0) {
        overdueList.push(item);
      } else if (kmRemaining <= 500 || daysRemaining <= 15) {
        upcomingList.push(item);
      }

      if (insuranceDays !== null && insuranceDays <= (serviceIntervals.insuranceNoticeDays || 30)) {
        insuranceList.push(item);
      }
    });

    return {
      overdueList,
      upcomingList,
      insuranceList,
      totalOverdue: overdueList.length,
      totalUpcoming: upcomingList.length,
      totalInsuranceAlerts: insuranceList.length
    };
  }, [bikesList, serviceIntervals]);

  // Handle Print Report
  const handlePrint = () => {
    window.print();
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const title = `${branding.companyName || 'Salem Bike Service'} - ${activeReportTab.toUpperCase()} REPORT`;

    if (activeReportTab === 'daily') {
      csvContent += `${title} - Date: ${selectedDailyDate}\n\n`;
      csvContent += `Category,Record ID,Registration,Owner,Phone,Date,KM,Details/Type,Cost (INR)\n`;
      dailyReportData.services.forEach(s => {
        csvContent += `"Service","${s.id}","${s.regNo}","${s.ownerName}","${s.ownerPhone}","${s.serviceDate}","${s.serviceKm}","${s.serviceType}","${s.serviceCost}"\n`;
      });
      dailyReportData.repairs.forEach(r => {
        csvContent += `"Repair","${r.id}","${r.regNo}","${r.ownerName}","${r.ownerPhone}","${r.repairDate}","${r.repairKm}","${(r.repairDetails || '').replace(/"/g, '""')}","${r.totalCost}"\n`;
      });
      csvContent += `\n"SUMMARY","Total Revenue","${dailyReportData.totalRevenue}","Services Count","${dailyReportData.serviceCount}","Repairs Count","${dailyReportData.repairCount}"\n`;
    } else if (activeReportTab === 'weekly') {
      csvContent += `${title} - Week: ${weeklyReportData.startDate} to ${weeklyReportData.endDate}\n\n`;
      csvContent += `Category,Record ID,Registration,Owner,Phone,Date,KM,Details/Type,Cost (INR)\n`;
      weeklyReportData.services.forEach(s => {
        csvContent += `"Service","${s.id}","${s.regNo}","${s.ownerName}","${s.ownerPhone}","${s.serviceDate}","${s.serviceKm}","${s.serviceType}","${s.serviceCost}"\n`;
      });
      weeklyReportData.repairs.forEach(r => {
        csvContent += `"Repair","${r.id}","${r.regNo}","${r.ownerName}","${r.ownerPhone}","${r.repairDate}","${r.repairKm}","${(r.repairDetails || '').replace(/"/g, '""')}","${r.totalCost}"\n`;
      });
      csvContent += `\n"SUMMARY","Total Revenue","${weeklyReportData.totalRevenue}","Services Count","${weeklyReportData.serviceCount}","Repairs Count","${weeklyReportData.repairCount}"\n`;
    } else if (activeReportTab === 'monthly') {
      csvContent += `${title} - Month: ${selectedMonth}\n\n`;
      csvContent += `Record Type,ID,Reg No,Owner,Phone,Date,KM,Cost (INR)\n`;
      monthlyReportData.services.forEach(s => {
        csvContent += `"Service","${s.id}","${s.regNo}","${s.ownerName}","${s.ownerPhone}","${s.serviceDate}","${s.serviceKm}","${s.serviceCost}"\n`;
      });
      monthlyReportData.repairs.forEach(r => {
        csvContent += `"Repair","${r.id}","${r.regNo}","${r.ownerName}","${r.ownerPhone}","${r.repairDate}","${r.repairKm}","${r.totalCost}"\n`;
      });
      csvContent += `\n"TOTALS","Revenue","${monthlyReportData.totalRevenue}","Service Revenue","${monthlyReportData.totalServiceCost}","Repair Revenue","${monthlyReportData.totalRepairCost}"\n`;
    } else if (activeReportTab === 'bike_history') {
      const b = bikeHistoryData.bike;
      csvContent += `${title} - Vehicle: ${b?.regNo} (${b?.brand} ${b?.model}) - Owner: ${b?.ownerName} (${b?.ownerPhone})\n\n`;
      csvContent += `Type,Date,Odometer KM,Technician,Description/Parts,Total Cost (INR)\n`;
      bikeHistoryData.services.forEach(s => {
        csvContent += `"Periodic Service","${s.serviceDate}","${s.serviceKm}","${s.technician}","${s.serviceType}","${s.serviceCost}"\n`;
      });
      bikeHistoryData.repairs.forEach(r => {
        const parts = (r.partsReplaced || []).map(p => `${p.partName}(x${p.quantity})`).join('; ');
        csvContent += `"Repair Work","${r.repairDate}","${r.repairKm}","${r.technician}","${(r.repairDetails || '')} [${parts}]","${r.totalCost}"\n`;
      });
      csvContent += `\n"LIFETIME EXPENDITURE","${bikeHistoryData.totalSpent}"\n`;
    } else if (activeReportTab === 'repairs') {
      csvContent += `${title} - All Maintenance & Repairs Breakdown\n\n`;
      csvContent += `Repair ID,Date,Reg No,Owner,KM,Technician,Parts Replaced,Parts Cost,Labor Cost,Total Cost\n`;
      repairMaintenanceData.repairs.forEach(r => {
        const partsStr = (r.partsReplaced || []).map(p => `${p.partName} x${p.quantity}=${p.total}`).join(' | ');
        const partsCost = (r.partsReplaced || []).reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
        csvContent += `"${r.id}","${r.repairDate}","${r.regNo}","${r.ownerName}","${r.repairKm}","${r.technician}","${partsStr}","${partsCost}","${r.laborCost}","${r.totalCost}"\n`;
      });
      csvContent += `\n"TOTALS","Repairs: ${repairMaintenanceData.totalRepairs}","Parts Cost: ${repairMaintenanceData.totalPartsCost}","Labor Cost: ${repairMaintenanceData.totalLaborCost}","Grand Total: ${repairMaintenanceData.totalRepairCost}"\n`;
    } else {
      csvContent += `${title} - Upcoming and Overdue Reminders\n\n`;
      csvContent += `Category,Reg No,Owner,Phone,Model,Current KM,Next Service KM,Remaining KM,Next Date,Days Left\n`;
      upcomingOverdueData.overdueList.forEach(b => {
        csvContent += `"OVERDUE","${b.regNo}","${b.ownerName}","${b.ownerPhone}","${b.brand} ${b.model}","${b.currentKm}","${b.nextServiceKm}","${b.kmRemaining}","${b.nextServiceDate}","${b.daysRemaining}"\n`;
      });
      upcomingOverdueData.upcomingList.forEach(b => {
        csvContent += `"UPCOMING","${b.regNo}","${b.ownerName}","${b.ownerPhone}","${b.brand} ${b.model}","${b.currentKm}","${b.nextServiceKm}","${b.kmRemaining}","${b.nextServiceDate}","${b.daysRemaining}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${activeReportTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle JSON Export
  const handleExportJSON = () => {
    let payload = {};
    if (activeReportTab === 'daily') payload = dailyReportData;
    else if (activeReportTab === 'weekly') payload = weeklyReportData;
    else if (activeReportTab === 'monthly') payload = monthlyReportData;
    else if (activeReportTab === 'bike_history') payload = bikeHistoryData;
    else if (activeReportTab === 'repairs') payload = repairMaintenanceData;
    else payload = upcomingOverdueData;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `report_${activeReportTab}_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="reports-page" style={{ paddingBottom: '40px' }}>
      {/* Header Banner - Premium Light SaaS Style */}
      <div className="dash-hero-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #EFF4FE, #DBEAFE)',
            color: '#356DF3',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#101828', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>Workshop Service & Repair Reports</span>
              <span style={{ 
                fontSize: '11px', 
                background: '#ECFDF3', 
                color: '#12B76A', 
                border: '1px solid #A6F4C5',
                padding: '2px 9px', 
                borderRadius: '9999px', 
                fontWeight: 700 
              }}>
                6 SYSTEM REPORTS
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#667085', marginTop: '3px' }}>
              Daily, weekly & monthly summaries • Bike service histories • Repair audits • Printable & CSV/JSON exports
            </div>
          </div>
        </div>

        {/* Global Export & Print Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary btn-sm"
          >
            <FileSpreadsheet size={14} color="#12B76A" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="btn-secondary btn-sm"
          >
            <FileCode size={14} color="#356DF3" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-primary btn-sm"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#ffffff',
        border: '1px solid #EAECF0',
        padding: '6px',
        borderRadius: '14px',
        overflowX: 'auto',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)'
      }}>
        <button
          type="button"
          onClick={() => setActiveReportTab('daily')}
          className={`profile-tab-pill ${activeReportTab === 'daily' ? 'active' : ''}`}
        >
          <Calendar size={15} />
          <span>Daily Service Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('weekly')}
          className={`profile-tab-pill ${activeReportTab === 'weekly' ? 'active' : ''}`}
        >
          <Calendar size={15} />
          <span>Weekly Service Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('monthly')}
          className={`profile-tab-pill ${activeReportTab === 'monthly' ? 'active' : ''}`}
        >
          <TrendingUp size={15} />
          <span>Monthly Service Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('bike_history')}
          className={`profile-tab-pill ${activeReportTab === 'bike_history' ? 'active' : ''}`}
        >
          <Bike size={15} />
          <span>Individual Bike History</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('repairs')}
          className={`profile-tab-pill ${activeReportTab === 'repairs' ? 'active' : ''}`}
        >
          <Wrench size={15} />
          <span>Repair & Maintenance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('upcoming_overdue')}
          className={`profile-tab-pill ${activeReportTab === 'upcoming_overdue' ? 'active' : ''}`}
        >
          <AlertTriangle size={15} />
          <span>Upcoming & Overdue</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. DAILY SERVICE REPORT VIEW */}
      {/* ==================================================================== */}
      {activeReportTab === 'daily' && (
        <div>
          {/* Filter Bar */}
          <div className="card" style={{ padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Select Date:</label>
              <input
                type="date"
                value={selectedDailyDate}
                onChange={(e) => setSelectedDailyDate(e.target.value)}
                className="form-input no-left-icon"
                style={{ width: '180px', padding: '6px 10px', fontSize: '13px' }}
              />
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setSelectedDailyDate(new Date().toISOString().split('T')[0])}
              >
                Today
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Services Logged: <strong>{dailyReportData.serviceCount}</strong>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Repairs Logged: <strong>{dailyReportData.repairCount}</strong>
              </div>
              <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 800 }}>
                Total Revenue: <span style={{ color: '#059669' }}>₹{dailyReportData.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Daily Services Table */}
          <div className="table-card" style={{ marginBottom: '20px' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">
                <Wrench size={18} color="#0284c7" />
                <span>Periodic Servicing Activities ({dailyReportData.serviceDate})</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>
                Subtotal: ₹{dailyReportData.totalServiceCost.toLocaleString()}
              </span>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Service ID</th>
                    <th>Vehicle & Model</th>
                    <th>Customer</th>
                    <th>Odometer</th>
                    <th>Service Type</th>
                    <th>Technician</th>
                    <th style={{ textAlign: 'right' }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReportData.services.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        No periodic servicing logged on {dailyReportData.date}
                      </td>
                    </tr>
                  ) : (
                    dailyReportData.services.map(s => (
                      <tr key={s.id}>
                        <td><strong style={{ color: '#0284c7' }}>{s.id}</strong></td>
                        <td><strong>{s.regNo}</strong></td>
                        <td>{s.ownerName} ({s.ownerPhone})</td>
                        <td>{s.serviceKm?.toLocaleString()} km</td>
                        <td>{s.serviceType}</td>
                        <td>{s.technician}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{s.serviceCost?.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Repairs Table */}
          <div className="table-card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">
                <Wrench size={18} color="#ea580c" />
                <span>Repairs & Part Replacements ({dailyReportData.serviceDate})</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ea580c' }}>
                Subtotal: ₹{dailyReportData.totalRepairCost.toLocaleString()}
              </span>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Repair ID</th>
                    <th>Vehicle</th>
                    <th>Customer</th>
                    <th>KM</th>
                    <th>Repair Description</th>
                    <th>Parts Replaced</th>
                    <th>Labor Cost</th>
                    <th style={{ textAlign: 'right' }}>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReportData.repairs.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        No repair jobs logged on {dailyReportData.date}
                      </td>
                    </tr>
                  ) : (
                    dailyReportData.repairs.map(r => (
                      <tr key={r.id}>
                        <td><strong style={{ color: '#ea580c' }}>{r.id}</strong></td>
                        <td><strong>{r.regNo}</strong></td>
                        <td>{r.ownerName}</td>
                        <td>{r.repairKm?.toLocaleString()} km</td>
                        <td>{r.repairDetails}</td>
                        <td>
                          {(r.partsReplaced || []).map(p => `${p.partName} (x${p.quantity})`).join(', ') || 'None'}
                        </td>
                        <td>₹{r.laborCost?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{r.totalCost?.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. WEEKLY SERVICE REPORT VIEW */}
      {/* ==================================================================== */}
      {activeReportTab === 'weekly' && (
        <div>
          {/* Filter Bar */}
          <div className="card" style={{ padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Week Ending Date:</label>
              <input
                type="date"
                value={selectedDailyDate}
                onChange={(e) => setSelectedDailyDate(e.target.value)}
                className="form-input no-left-icon"
                style={{ width: '180px', padding: '6px 10px', fontSize: '13px' }}
              />
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Covering 7-Day Window: <strong>{weeklyReportData.startDate}</strong> to <strong>{weeklyReportData.endDate}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setSelectedDailyDate(new Date().toISOString().split('T')[0])}
              >
                Current Week
              </button>
            </div>
          </div>

          {/* 4 Weekly KPI Summary Cards */}
          <div className="metrics-row" style={{ marginBottom: '16px' }}>
            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <DollarSign size={20} />
              </div>
              <div className="metric-content">
                <span className="metric-title">Weekly Total Revenue</span>
                <span className="metric-value">₹{weeklyReportData.totalRevenue.toLocaleString()}</span>
                <span className="metric-subtitle">Services + Repairs</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#356DF3' }}>
                <Wrench size={20} />
              </div>
              <div className="metric-content">
                <span className="metric-title">Periodic Services</span>
                <span className="metric-value">{weeklyReportData.serviceCount}</span>
                <span className="metric-subtitle">₹{weeklyReportData.totalServiceCost.toLocaleString()} Subtotal</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#fff7ed', color: '#ea580c' }}>
                <CheckCircle2 size={20} />
              </div>
              <div className="metric-content">
                <span className="metric-title">Mechanical Repairs</span>
                <span className="metric-value">{weeklyReportData.repairCount}</span>
                <span className="metric-subtitle">₹{weeklyReportData.totalRepairCost.toLocaleString()} Subtotal</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Bike size={20} />
              </div>
              <div className="metric-content">
                <span className="metric-title">Total Vehicles Serviced</span>
                <span className="metric-value">{weeklyReportData.serviceCount + weeklyReportData.repairCount}</span>
                <span className="metric-subtitle">Across Salem bays</span>
              </div>
            </div>
          </div>

          {/* Weekly Services Table */}
          <div className="table-card" style={{ marginBottom: '20px' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">
                <Wrench size={18} color="#356DF3" />
                <span>Periodic Servicing Records ({weeklyReportData.startDate} to {weeklyReportData.endDate})</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#356DF3' }}>
                Subtotal: ₹{weeklyReportData.totalServiceCost.toLocaleString()}
              </span>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Service ID</th>
                    <th>Date</th>
                    <th>Vehicle Reg</th>
                    <th>Customer</th>
                    <th>Odometer</th>
                    <th>Service Type</th>
                    <th>Technician</th>
                    <th style={{ textAlign: 'right' }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyReportData.services.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        No periodic servicing logged during this 7-day period.
                      </td>
                    </tr>
                  ) : (
                    weeklyReportData.services.map(s => (
                      <tr key={s.id}>
                        <td><strong style={{ color: '#356DF3' }}>{s.id}</strong></td>
                        <td>{s.serviceDate}</td>
                        <td><strong>{s.regNo}</strong></td>
                        <td>{s.ownerName} ({s.ownerPhone})</td>
                        <td>{s.serviceKm?.toLocaleString()} km</td>
                        <td>{s.serviceType}</td>
                        <td>{s.technician}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{s.serviceCost?.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Repairs Table */}
          <div className="table-card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">
                <Wrench size={18} color="#ea580c" />
                <span>Repairs & Part Replacements ({weeklyReportData.startDate} to {weeklyReportData.endDate})</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ea580c' }}>
                Subtotal: ₹{weeklyReportData.totalRepairCost.toLocaleString()}
              </span>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Repair ID</th>
                    <th>Date</th>
                    <th>Vehicle Reg</th>
                    <th>Customer</th>
                    <th>KM</th>
                    <th>Work Details</th>
                    <th>Parts Replaced</th>
                    <th>Labor</th>
                    <th style={{ textAlign: 'right' }}>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyReportData.repairs.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        No repair jobs logged during this 7-day period.
                      </td>
                    </tr>
                  ) : (
                    weeklyReportData.repairs.map(r => (
                      <tr key={r.id}>
                        <td><strong style={{ color: '#ea580c' }}>{r.id}</strong></td>
                        <td>{r.repairDate}</td>
                        <td><strong>{r.regNo}</strong></td>
                        <td>{r.ownerName}</td>
                        <td>{r.repairKm?.toLocaleString()} km</td>
                        <td>{r.repairDetails}</td>
                        <td>
                          {(r.partsReplaced || []).map(p => `${p.partName} (x${p.quantity})`).join(', ') || 'None'}
                        </td>
                        <td>₹{r.laborCost?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{r.totalCost?.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MONTHLY SERVICE REPORT VIEW */}
      {/* ==================================================================== */}
      {activeReportTab === 'monthly' && (
        <div>
          {/* Controls */}
          <div className="card" style={{ padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Select Month:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="form-input no-left-icon"
                style={{ width: '180px', padding: '6px 10px', fontSize: '13px' }}
              />
            </div>

            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Viewing aggregated workshop revenue and service distribution for {selectedMonth}
            </div>
          </div>

          {/* Monthly KPI Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginBottom: '20px'
          }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Total Monthly Revenue</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                ₹{monthlyReportData.totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Services: ₹{monthlyReportData.totalServiceCost.toLocaleString()} • Repairs: ₹{monthlyReportData.totalRepairCost.toLocaleString()}
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Services Completed</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7', marginTop: '6px' }}>
                {monthlyReportData.totalServices}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Periodic & general maintenance
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Repairs Handled</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ea580c', marginTop: '6px' }}>
                {monthlyReportData.totalRepairs}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Parts: ₹{monthlyReportData.totalPartsCost.toLocaleString()} • Labor: ₹{monthlyReportData.totalLaborCost.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Monthly Aggregated Table */}
          <div className="table-card">
            <div className="card-header">
              <div className="card-title">
                <FileText size={18} color="#0284c7" />
                <span>Monthly Servicing & Repair Ledger ({monthlyReportData.monthYear})</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Vehicle Reg</th>
                    <th>Customer Name</th>
                    <th>Odometer KM</th>
                    <th>Technician</th>
                    <th style={{ textAlign: 'right' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...monthlyReportData.services, ...monthlyReportData.repairs].length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        No service or repair activity recorded for {monthlyReportData.monthYear}
                      </td>
                    </tr>
                  ) : (
                    [
                      ...monthlyReportData.services.map(s => ({ ...s, isService: true })),
                      ...monthlyReportData.repairs.map(r => ({ ...r, isService: false }))
                    ]
                    .sort((a, b) => new Date(b.serviceDate || b.repairDate) - new Date(a.serviceDate || a.repairDate))
                    .map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: item.isService ? '#e0f2fe' : '#ffedd5',
                            color: item.isService ? '#0369a1' : '#c2410c'
                          }}>
                            {item.isService ? 'SERVICE' : 'REPAIR'}
                          </span>
                        </td>
                        <td>{item.serviceDate || item.repairDate}</td>
                        <td><strong>{item.regNo}</strong></td>
                        <td>{item.ownerName}</td>
                        <td>{(item.serviceKm || item.repairKm)?.toLocaleString()} km</td>
                        <td>{item.technician || 'Mani'}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          ₹{(item.serviceCost || item.totalCost)?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. INDIVIDUAL BIKE SERVICE HISTORY VIEW */}
      {/* ==================================================================== */}
      {activeReportTab === 'bike_history' && (
        <div>
          {/* Bike Selector Card */}
          <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '260px' }}>
                <label className="form-label">Select Registered Bike to View Complete Lifetime History:</label>
                <select
                  className="filter-select"
                  value={selectedBikeId}
                  onChange={(e) => setSelectedBikeId(e.target.value)}
                  style={{ width: '100%', fontSize: '14px', fontWeight: 600 }}
                >
                  {bikesList.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.regNo} - {b.brand} {b.model} ({b.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              {currentSelectedBike && (
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  background: '#f8fafc',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Current Odometer</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                      {currentSelectedBike.currentKm?.toLocaleString()} km
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Owner Mobile</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>
                      {currentSelectedBike.ownerPhone}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Total Money Spent</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#059669' }}>
                      ₹{bikeHistoryData.totalSpent?.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bike History Details */}
          {currentSelectedBike && (
            <div className="table-card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="card-title">
                  <Bike size={18} color="#0284c7" />
                  <span>Comprehensive Timeline for {currentSelectedBike.regNo} ({currentSelectedBike.brand} {currentSelectedBike.model})</span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {bikeHistoryData.serviceCount} Services • {bikeHistoryData.repairCount} Repairs
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Event Type</th>
                      <th>Date</th>
                      <th>Odometer KM</th>
                      <th>Details & Checklist</th>
                      <th>Parts Replaced / Notes</th>
                      <th>Technician</th>
                      <th style={{ textAlign: 'right' }}>Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...bikeHistoryData.services, ...bikeHistoryData.repairs].length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          No service or repair history found for this vehicle
                        </td>
                      </tr>
                    ) : (
                      [
                        ...bikeHistoryData.services.map(s => ({ ...s, isService: true })),
                        ...bikeHistoryData.repairs.map(r => ({ ...r, isService: false }))
                      ]
                      .sort((a, b) => new Date(b.serviceDate || b.repairDate) - new Date(a.serviceDate || a.repairDate))
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              background: item.isService ? '#e0f2fe' : '#ffedd5',
                              color: item.isService ? '#0369a1' : '#c2410c'
                            }}>
                              {item.isService ? 'PERIODIC SERVICE' : 'REPAIR WORK'}
                            </span>
                          </td>
                          <td>{item.serviceDate || item.repairDate}</td>
                          <td><strong>{(item.serviceKm || item.repairKm)?.toLocaleString()} km</strong></td>
                          <td>{item.serviceType || item.repairDetails}</td>
                          <td>
                            {item.isService ? (
                              <span style={{ fontSize: '12px', color: '#64748b' }}>
                                Next due: {item.nextServiceDate} ({item.nextServiceKm?.toLocaleString()} km)
                              </span>
                            ) : (
                              (item.partsReplaced || []).map(p => `${p.partName} (x${p.quantity})`).join(', ') || 'No parts'
                            )}
                          </td>
                          <td>{item.technician || 'Mani'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                            ₹{(item.serviceCost || item.totalCost)?.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. REPAIR AND MAINTENANCE REPORT VIEW */}
      {/* ==================================================================== */}
      {activeReportTab === 'repairs' && (
        <div>
          {/* KPI Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginBottom: '20px'
          }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Total Repair Jobs</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                {repairMaintenanceData.totalRepairs}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                All logged customer repairs
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Total Parts Replacement Cost</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7', marginTop: '6px' }}>
                ₹{repairMaintenanceData.totalPartsCost.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Hardware & spares invoiced
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Total Labor Cost</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#7c3aed', marginTop: '6px' }}>
                ₹{repairMaintenanceData.totalLaborCost.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Technician repair charges
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Grand Total Repairs</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                ₹{repairMaintenanceData.totalRepairCost.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Parts + Labor billed
              </div>
            </div>
          </div>

          {/* Repairs Table */}
          <div className="table-card">
            <div className="card-header">
              <div className="card-title">
                <Wrench size={18} color="#ea580c" />
                <span>Complete Repair & Spares Maintenance Audit</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Repair ID</th>
                    <th>Date</th>
                    <th>Vehicle Reg</th>
                    <th>Customer Name</th>
                    <th>Odometer KM</th>
                    <th>Repair Details</th>
                    <th>Parts Replaced & Cost Breakdown</th>
                    <th>Labor</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {repairMaintenanceData.repairs.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        No repair records found in system
                      </td>
                    </tr>
                  ) : (
                    repairMaintenanceData.repairs.map(r => {
                      const partsCost = (r.partsReplaced || []).reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
                      return (
                        <tr key={r.id}>
                          <td><strong style={{ color: '#ea580c' }}>{r.id}</strong></td>
                          <td>{r.repairDate}</td>
                          <td><strong>{r.regNo}</strong></td>
                          <td>{r.ownerName} ({r.ownerPhone})</td>
                          <td>{r.repairKm?.toLocaleString()} km</td>
                          <td>{r.repairDetails}</td>
                          <td>
                            {(r.partsReplaced || []).length > 0 ? (
                              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#475569' }}>
                                {r.partsReplaced.map((p, pIdx) => (
                                  <li key={pIdx}>
                                    {p.partName} × {p.quantity} = ₹{(p.total || 0).toLocaleString()}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '12px' }}>No replacement parts</span>
                            )}
                          </td>
                          <td>₹{r.laborCost?.toLocaleString()}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                            ₹{r.totalCost?.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. UPCOMING AND OVERDUE SERVICE REPORT VIEW */}
      {/* ==================================================================== */}
      {activeReportTab === 'upcoming_overdue' && (
        <div>
          {/* Overdue Section */}
          <div className="table-card" style={{ marginBottom: '24px' }}>
            <div className="card-header" style={{ background: '#fef2f2', borderBottom: '1px solid #fee2e2' }}>
              <div className="card-title" style={{ color: '#dc2626' }}>
                <AlertTriangle size={18} color="#ef4444" />
                <span>Overdue Services Report ({upcomingOverdueData.totalOverdue} Vehicles Urgent Attention Required)</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Vehicle Reg</th>
                    <th>Model</th>
                    <th>Customer</th>
                    <th>Current KM</th>
                    <th>Service Due KM</th>
                    <th>KM Overdue</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingOverdueData.overdueList.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#16a34a' }}>
                        🎉 Great! No vehicles are currently overdue for service.
                      </td>
                    </tr>
                  ) : (
                    upcomingOverdueData.overdueList.map(b => (
                      <tr key={b.id} style={{ background: '#fff5f5' }}>
                        <td><strong style={{ color: '#b91c1c' }}>{b.regNo}</strong></td>
                        <td>{b.brand} {b.model}</td>
                        <td>{b.ownerName} ({b.ownerPhone})</td>
                        <td>{b.currentKm?.toLocaleString()} km</td>
                        <td>{b.nextServiceKm?.toLocaleString()} km</td>
                        <td>
                          {b.kmRemaining <= 0 ? (
                            <span style={{ color: '#dc2626', fontWeight: 800 }}>
                              +{Math.abs(b.kmRemaining).toLocaleString()} km
                            </span>
                          ) : (
                            <span style={{ color: '#64748b' }}>-</span>
                          )}
                        </td>
                        <td>{b.nextServiceDate}</td>
                        <td>
                          {b.daysRemaining < 0 ? (
                            <span style={{ color: '#dc2626', fontWeight: 800 }}>
                              {Math.abs(b.daysRemaining)} days ago
                            </span>
                          ) : (
                            <span style={{ color: '#64748b' }}>-</span>
                          )}
                        </td>
                        <td>
                          <span style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px'
                          }}>
                            OVERDUE
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Section */}
          <div className="table-card" style={{ marginBottom: '24px' }}>
            <div className="card-header" style={{ background: '#fffbeb', borderBottom: '1px solid #fef3c7' }}>
              <div className="card-title" style={{ color: '#d97706' }}>
                <Clock size={18} color="#f59e0b" />
                <span>Upcoming Services Report ({upcomingOverdueData.totalUpcoming} Vehicles Due Within 500 KM / 15 Days)</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Vehicle Reg</th>
                    <th>Model</th>
                    <th>Customer</th>
                    <th>Current KM</th>
                    <th>Next Target KM</th>
                    <th>KM Remaining</th>
                    <th>Target Date</th>
                    <th>Days Remaining</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingOverdueData.upcomingList.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                        No upcoming services due within next 500 km or 15 days.
                      </td>
                    </tr>
                  ) : (
                    upcomingOverdueData.upcomingList.map(b => (
                      <tr key={b.id} style={{ background: '#fffdf5' }}>
                        <td><strong style={{ color: '#b45309' }}>{b.regNo}</strong></td>
                        <td>{b.brand} {b.model}</td>
                        <td>{b.ownerName} ({b.ownerPhone})</td>
                        <td>{b.currentKm?.toLocaleString()} km</td>
                        <td>{b.nextServiceKm?.toLocaleString()} km</td>
                        <td>
                          <strong style={{ color: '#d97706' }}>{b.kmRemaining?.toLocaleString()} km</strong>
                        </td>
                        <td>{b.nextServiceDate}</td>
                        <td>
                          <strong style={{ color: '#d97706' }}>{b.daysRemaining} days</strong>
                        </td>
                        <td>
                          <span style={{
                            background: '#fef3c7',
                            color: '#b45309',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px'
                          }}>
                            UPCOMING
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insurance Alert Section */}
          <div className="table-card">
            <div className="card-header" style={{ background: '#faf5ff', borderBottom: '1px solid #f3e8ff' }}>
              <div className="card-title" style={{ color: '#7e22ce' }}>
                <ShieldAlert size={18} color="#9333ea" />
                <span>Insurance Expiry Alerts ({upcomingOverdueData.totalInsuranceAlerts} Vehicles Due for Renewal)</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Vehicle Reg</th>
                    <th>Model</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Insurance Expiry Date</th>
                    <th>Days Remaining</th>
                    <th>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingOverdueData.insuranceList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#16a34a' }}>
                        All insured vehicles are well within their validity period.
                      </td>
                    </tr>
                  ) : (
                    upcomingOverdueData.insuranceList.map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.regNo}</strong></td>
                        <td>{b.brand} {b.model}</td>
                        <td>{b.ownerName}</td>
                        <td>{b.ownerPhone}</td>
                        <td>{b.insuranceExpiryDate}</td>
                        <td>
                          {b.insuranceDays < 0 ? (
                            <span style={{ color: '#dc2626', fontWeight: 800 }}>EXPIRED ({Math.abs(b.insuranceDays)} days ago)</span>
                          ) : (
                            <span style={{ color: '#7e22ce', fontWeight: 800 }}>{b.insuranceDays} days left</span>
                          )}
                        </td>
                        <td>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: b.insuranceDays < 0 ? '#fee2e2' : '#f3e8ff',
                            color: b.insuranceDays < 0 ? '#b91c1c' : '#7e22ce'
                          }}>
                            {b.insuranceDays < 0 ? 'NON-COMPLIANT' : 'RENEWAL DUE'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

