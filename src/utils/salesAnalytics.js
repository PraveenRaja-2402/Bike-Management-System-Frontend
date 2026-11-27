const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseRecordDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getPartsAndLabourFromRepair(repair) {
  const partsCost = (repair.partsReplaced || []).reduce((sum, part) => {
    const qty = Number(part?.quantity ?? 1) || 1;
    const unit = Number(part?.unitCost ?? 0) || 0;
    const total = Number(part?.total ?? qty * unit) || 0;
    return sum + total;
  }, 0);
  const labourCost = Number(repair.laborCost ?? repair.labourCost ?? 0) || 0;
  const totalCost = Number(repair.totalCost ?? (partsCost + labourCost)) || (partsCost + labourCost);
  const serviceExtra = Math.max(0, totalCost - partsCost - labourCost);
  return { partsCost, labourCost, serviceExtra, totalCost };
}

export function computeSalesAnalytics({
  serviceRecords = [],
  repairRecords = [],
  jobCardsList = [],
  referenceDate = new Date()
} = {}) {
  const now = parseRecordDate(referenceDate) || new Date();
  const todayKey = now.toISOString().split('T')[0];
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const syncedJobNos = new Set(
    serviceRecords
      .map(sr => sr.jobNo)
      .filter(Boolean)
  );

  // Build unified, deduplicated transactions list
  const transactions = [];

  for (const sr of serviceRecords) {
    const amount = Number(sr.serviceCost) || 0;
    transactions.push({
      source: 'service',
      date: parseRecordDate(sr.serviceDate),
      label: sr.serviceType || 'General Periodic Service',
      serviceRevenue: amount,
      partsRevenue: 0,
      labourRevenue: 0,
      total: amount
    });
  }

  for (const rep of repairRecords) {
    const { partsCost, labourCost, serviceExtra, totalCost } = getPartsAndLabourFromRepair(rep);
    transactions.push({
      source: 'repair',
      date: parseRecordDate(rep.repairDate),
      label: rep.issueTitle || 'Repair & Parts Replacement',
      serviceRevenue: serviceExtra,
      partsRevenue: partsCost,
      labourRevenue: labourCost,
      total: totalCost,
      partsReplaced: rep.partsReplaced || []
    });
  }

  // Only include completed job cards that were NOT already synced to serviceRecords
  for (const job of jobCardsList) {
    const stage = job.stage || job.status;
    const isCompleted = stage === 'Job Completed' || stage === 'Completed';
    if (!isCompleted) continue;
    if (job.syncedServiceId || (job.jobNo && syncedJobNos.has(job.jobNo))) continue;

    const partsCost = Number(job.partsCost ?? 0) || 0;
    const labourCost = Number(job.labourCost ?? job.labourCharges ?? 0) || 0;
    const totalCost = Number(job.totalAmount ?? job.totalCost ?? (partsCost + labourCost)) || 0;
    const serviceExtra = Math.max(0, totalCost - partsCost - labourCost);

    transactions.push({
      source: 'job',
      date: parseRecordDate(job.completionDate && job.completionDate !== 'Pending' ? job.completionDate : job.date),
      label: job.serviceType || 'Job Completion Service',
      serviceRevenue: serviceExtra,
      partsRevenue: partsCost,
      labourRevenue: labourCost,
      total: totalCost
    });
  }

  let dailySales = 0;
  let weeklySales = 0;
  let monthlySales = 0;
  let yearlySales = 0;
  let totalRevenue = 0;
  let serviceRevenue = 0;
  let sparePartsRevenue = 0;
  let labourRevenue = 0;

  // Build 6-month trailing buckets ending at currentMonth
  const monthBuckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    monthBuckets.push({
      year: d.getFullYear(),
      monthIdx: d.getMonth(),
      month: MONTH_NAMES[d.getMonth()],
      service: 0,
      parts: 0,
      labour: 0,
      total: 0
    });
  }

  const serviceAgg = new Map();
  const partsAgg = new Map();

  for (const tx of transactions) {
    totalRevenue += tx.total;
    serviceRevenue += tx.serviceRevenue;
    sparePartsRevenue += tx.partsRevenue;
    labourRevenue += tx.labourRevenue;

    if (tx.date) {
      const txDayKey = tx.date.toISOString().split('T')[0];
      if (txDayKey === todayKey) dailySales += tx.total;
      if (tx.date >= weekStart && tx.date <= now) weeklySales += tx.total;
      if (tx.date.getFullYear() === currentYear) yearlySales += tx.total;
      if (tx.date.getFullYear() === currentYear && tx.date.getMonth() === currentMonth) {
        monthlySales += tx.total;
      }

      const bucket = monthBuckets.find(
        b => b.year === tx.date.getFullYear() && b.monthIdx === tx.date.getMonth()
      );
      if (bucket) {
        bucket.service += tx.serviceRevenue;
        bucket.parts += tx.partsRevenue;
        bucket.labour += tx.labourRevenue;
        bucket.total += tx.total;
      }
    }

    if (tx.label) {
      const prev = serviceAgg.get(tx.label) || { name: tx.label, count: 0, revenue: 0 };
      prev.count += 1;
      prev.revenue += tx.total;
      serviceAgg.set(tx.label, prev);
    }

    if (Array.isArray(tx.partsReplaced)) {
      for (const part of tx.partsReplaced) {
        const name = part?.partName || part?.name;
        if (!name) continue;
        const qty = Number(part?.quantity ?? 1) || 1;
        const unit = Number(part?.unitCost ?? 0) || 0;
        const rev = Number(part?.total ?? qty * unit) || 0;
        const prevPart = partsAgg.get(name) || {
          name,
          sku: part?.sku || 'PART-LIVE',
          unitsSold: 0,
          revenue: 0
        };
        prevPart.unitsSold += qty;
        prevPart.revenue += rev;
        partsAgg.set(name, prevPart);
      }
    }
  }

  const topSellingServices = Array.from(serviceAgg.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(item => ({
      ...item,
      share: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0
    }));

  const topSellingParts = Array.from(partsAgg.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    summary: {
      dailySales,
      weeklySales,
      monthlySales,
      yearlySales,
      totalRevenue,
      serviceRevenue,
      sparePartsRevenue,
      labourRevenue,
      transactionCount: transactions.length
    },
    monthlyComparison: monthBuckets,
    topSellingServices,
    topSellingParts
  };
}
