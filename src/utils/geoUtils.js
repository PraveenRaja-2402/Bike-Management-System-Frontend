export const DEFAULT_MARKED_AREAS = [
  {
    id: 'area-salem-central',
    name: 'Salem Central Hub Zone',
    color: '#2563eb',
    description: 'Primary service bay & pickup coverage perimeter',
    points: [
      [11.6685, 78.1405],
      [11.6692, 78.1518],
      [11.6602, 78.1525],
      [11.6595, 78.1412]
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'area-fairlands',
    name: 'Fairlands Express Zone',
    color: '#10b981',
    description: 'Express maintenance & roadside assistance zone',
    points: [
      [11.6762, 78.1482],
      [11.6768, 78.1578],
      [11.6698, 78.1582],
      [11.6694, 78.1488]
    ],
    createdAt: '2026-09-05'
  }
];

export function isPointInPolygon(lat, lng, polygonPoints = []) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Array.isArray(polygonPoints) || polygonPoints.length < 3) {
    return false;
  }

  let inside = false;
  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const xi = Number(polygonPoints[i]?.[0]);
    const yi = Number(polygonPoints[i]?.[1]);
    const xj = Number(polygonPoints[j]?.[0]);
    const yj = Number(polygonPoints[j]?.[1]);

    if (!Number.isFinite(xi) || !Number.isFinite(yi) || !Number.isFinite(xj) || !Number.isFinite(yj)) {
      continue;
    }

    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < ((xj - xi) * (lng - yi)) / ((yj - yi) || 1e-12) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function findMarkedAreaForCoordinates(lat, lng, markedAreas = []) {
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (!Number.isFinite(numLat) || !Number.isFinite(numLng) || !Array.isArray(markedAreas)) {
    return null;
  }
  return markedAreas.find(area => isPointInPolygon(numLat, numLng, area.points)) || null;
}

export function getPolygonCenter(points = []) {
  if (!Array.isArray(points) || points.length === 0) return [11.6643, 78.1460];
  let sumLat = 0;
  let sumLng = 0;
  let count = 0;
  for (const pt of points) {
    const lat = Number(pt?.[0]);
    const lng = Number(pt?.[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      sumLat += lat;
      sumLng += lng;
      count += 1;
    }
  }
  return count > 0 ? [sumLat / count, sumLng / count] : [11.6643, 78.1460];
}
