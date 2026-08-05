// Single canonical mock status-count map shared by the incident management
// page (stat tiles + NSTT table) and the landing page's Incident Management
// overview card, so their numbers can't drift apart. Swap for a real API
// response once backend integration lands.
export const INCIDENT_STATUS_COUNTS: Record<string, number> = {
  unknown: 0,
  inProgress: 28,
  assigned: 9,
  escalated: 0,
  resolved: 3,
  closed: 1,
  cancelled: 0,
};

export const INCIDENT_TOTAL_COUNT =
  Object.values(INCIDENT_STATUS_COUNTS).reduce((sum, count) => sum + count, 0);
