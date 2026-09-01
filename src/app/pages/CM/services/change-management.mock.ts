import { DashboardChangeRow, DashboardChangeStatus, StatCard } from '../landing/change-management-landing.types';
import { ImpactedLsiDetail, OutageCommunicationRecord, PlannedOutage } from '../components/types';
import {
  CmDashboardData, CrqPageData, LinkStatusResponse, MailOutageResponse,
  PoInternalResponse, ServiceImpactApiRow, SyncPoResponse,
} from './change-management.types';

// Mock data layer for Change Management — used unconditionally whenever
// environment.useMockChangeManagement is true (see ChangeManagementService),
// and as the error-fallback for any call made while it's false. Every
// method here is synchronous (no delay/setTimeout) so pages backed by it
// render instantly — see requirement that CM must never show a real
// "fetching..." wait.

const CARD_META: { key: string; label: string; viewText: string; color: string; bg: string; icon: string }[] = [
  { key: 'all', label: 'All Changes', viewText: 'View all changes', color: '#ed7199', bg: 'rgba(237, 113, 153, 0.08)', icon: '/assets/change-management/Icon-6.png' },
  { key: 'scheduled', label: 'Scheduled', viewText: 'View scheduled', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', icon: '/assets/change-management/Iconsch.png' },
  { key: 'rejected', label: 'Rejected', viewText: 'View rejected', color: '#e60012', bg: '#fef2f2', icon: '/assets/change-management/Icon-5.png' },
  { key: 'in-progress', label: 'In Progress', viewText: 'View in progress', color: '#4664aa', bg: 'rgba(70, 100, 170, 0.08)', icon: '/assets/change-management/Icon-4.png' },
  { key: 'completed', label: 'Completed', viewText: 'View completed', color: '#22c55e', bg: 'rgba(99, 205, 90, 0.08)', icon: '/assets/change-management/Icon-3.png' },
  { key: 'cancelled', label: 'Cancelled', viewText: 'View cancelled', color: '#ff9900', bg: 'rgba(255, 153, 0, 0.08)', icon: '/assets/change-management/Icon-2.png' },
];

const KEY_TO_STATUS: Record<string, DashboardChangeStatus> = {
  scheduled: 'Scheduled', rejected: 'Rejected', 'in-progress': 'In Progress',
  completed: 'Completed', cancelled: 'Cancelled',
};

// ---------- Dashboard (Landing page + Landing "Change management" card) ----------

interface DashboardSeed { changeId: string; plannedOutageId: string; status: DashboardChangeStatus; createdOn: string; }

const DASHBOARD_SEED: DashboardSeed[] = [
  { changeId: 'CRQ000006123457', plannedOutageId: '110039401', status: 'Scheduled',   createdOn: '18 Aug 2026, 09:15 AM' },
  { changeId: 'CRQ000006123412', plannedOutageId: '110039398', status: 'In Progress', createdOn: '18 Aug 2026, 07:40 AM' },
  { changeId: 'CRQ000006123390', plannedOutageId: '110039384', status: 'Completed',   createdOn: '17 Aug 2026, 10:22 PM' },
  { changeId: 'CRQ000006123371', plannedOutageId: '110039376', status: 'Rejected',    createdOn: '17 Aug 2026, 06:05 PM' },
  { changeId: 'CRQ000006123365', plannedOutageId: '110039370', status: 'Cancelled',   createdOn: '17 Aug 2026, 02:48 PM' },
  { changeId: 'CRQ000006123349', plannedOutageId: '110039362', status: 'Emergency',   createdOn: '17 Aug 2026, 11:30 AM' },
  { changeId: 'CRQ000006123330', plannedOutageId: '110039355', status: 'Planned',     createdOn: '16 Aug 2026, 09:10 PM' },
  { changeId: 'CRQ000006123318', plannedOutageId: '110039347', status: 'Open',        createdOn: '16 Aug 2026, 04:52 PM' },
  { changeId: 'CRQ000006123301', plannedOutageId: '110039340', status: 'Scheduled',   createdOn: '16 Aug 2026, 01:15 PM' },
  { changeId: 'CRQ000006123287', plannedOutageId: '110039333', status: 'In Progress', createdOn: '16 Aug 2026, 09:47 AM' },
  { changeId: 'CRQ000006123265', plannedOutageId: '110039321', status: 'Completed',   createdOn: '15 Aug 2026, 11:03 PM' },
  { changeId: 'CRQ000006123249', plannedOutageId: '110039314', status: 'Scheduled',   createdOn: '15 Aug 2026, 06:38 PM' },
  { changeId: 'CRQ000006123231', plannedOutageId: '110039307', status: 'Completed',   createdOn: '15 Aug 2026, 02:12 PM' },
  { changeId: 'CRQ000006123210', plannedOutageId: '110039296', status: 'Cancelled',   createdOn: '15 Aug 2026, 10:26 AM' },
  { changeId: 'CRQ000006123198', plannedOutageId: '110039288', status: 'In Progress', createdOn: '14 Aug 2026, 09:59 PM' },
  { changeId: 'CRQ000006123176', plannedOutageId: '110039279', status: 'Rejected',    createdOn: '14 Aug 2026, 05:14 PM' },
  { changeId: 'CRQ000006123154', plannedOutageId: '110039268', status: 'Planned',     createdOn: '14 Aug 2026, 01:41 PM' },
  { changeId: 'CRQ000006123130', plannedOutageId: '110039257', status: 'Emergency',   createdOn: '14 Aug 2026, 08:22 AM' },
  { changeId: 'CRQ000006123112', plannedOutageId: '110039246', status: 'Scheduled',   createdOn: '13 Aug 2026, 07:33 PM' },
  { changeId: 'CRQ000006123098', plannedOutageId: '110039235', status: 'Completed',   createdOn: '13 Aug 2026, 03:05 PM' },
  { changeId: 'CRQ000005963007', plannedOutageId: '110039400', status: 'Scheduled',   createdOn: '13 Aug 2026, 11:47 AM' },
  { changeId: 'CRQ000006123071', plannedOutageId: '110039221', status: 'Open',        createdOn: '13 Aug 2026, 08:19 AM' },
  { changeId: 'CRQ000006123054', plannedOutageId: '110039209', status: 'In Progress', createdOn: '12 Aug 2026, 09:52 PM' },
  { changeId: 'CRQ000006123038', plannedOutageId: '110039198', status: 'Completed',   createdOn: '12 Aug 2026, 04:30 PM' },
  { changeId: 'CRQ000006123019', plannedOutageId: '110039187', status: 'Cancelled',   createdOn: '12 Aug 2026, 10:08 AM' },
];

function buildMockChanges(): DashboardChangeRow[] {
  return DASHBOARD_SEED.map(s => ({ changeId: s.changeId, plannedOutageId: s.plannedOutageId, status: s.status, createdOn: s.createdOn }));
}

export function getMockDashboardData(): CmDashboardData {
  const changes = buildMockChanges();
  const count = (status: DashboardChangeStatus) => changes.filter(c => c.status === status).length;
  const statCards: StatCard[] = CARD_META.map(meta => ({
    key: meta.key,
    label: meta.label,
    count: meta.key === 'all' ? changes.length : count(KEY_TO_STATUS[meta.key]),
    viewText: meta.viewText,
    color: meta.color,
    bg: meta.bg,
    icon: meta.icon,
  }));
  return { statCards, changes };
}

// ---------- Impacted LSI (Additional Details tab) ----------

const PARTY_POOL = [
  'Reliance Industries Ltd', 'Tata Consultancy Services', 'Infosys Limited',
  'HDFC Bank Ltd', 'Wipro Technologies', 'ICICI Bank Ltd',
  'Larsen & Toubro', 'State Bank of India', 'Mahindra Group', 'Bharti Enterprises',
];
const SERVICE_TYPE_POOL = ['MPLS L3 VPN', 'Internet Leased Line', 'MPLS L2 VPN', 'SD-WAN Managed'];
const LSI_STATUS_POOL = ['Active', 'Pending Migration', 'Under Maintenance', 'Newly Provisioned', 'Decommissioned'];
const IMPLEMENTER_POOL = [
  'changemgmt@airtel.com', 'network.ops@airtel.com', 'noc.enterprise@airtel.com',
  'fieldops.south@airtel.com', 'provisioning.team@airtel.com',
];
// Remarks keyed by status so a row never pairs e.g. "Decommissioned" with a
// remark describing an in-progress upgrade.
const LSI_REMARKS_BY_STATUS: Record<string, string[]> = {
  Active: ['Primary link carrying core banking application traffic — coordinate with customer NOC before any cutover.', 'Live production path, monitored under standard SLA.'],
  'Pending Migration': ['Redundant path scheduled for migration — no customer impact expected during the maintenance window.', 'Awaiting maintenance window confirmation before cutover.'],
  'Under Maintenance': ['Bandwidth upgrade in progress — monitor for packet loss during migration.', 'Firmware patch being applied, brief flaps expected.'],
  'Newly Provisioned': ['New service activation validated post go-live checks.', 'Provisioned this cycle, pending first health-check cycle.'],
  Decommissioned: ['Awaiting customer confirmation before final decommission.', 'Traffic already drained, teardown scheduled next maintenance window.'],
};

function buildImpactedLsis(outageIdSeed: number, count: number): ImpactedLsiDetail[] {
  const rows: ImpactedLsiDetail[] = [];
  for (let i = 0; i < count; i++) {
    const idx = outageIdSeed + i;
    const status = LSI_STATUS_POOL[idx % LSI_STATUS_POOL.length];
    const remarksForStatus = LSI_REMARKS_BY_STATUS[status];
    rows.push({
      id: `ILSI-${(outageIdSeed * 10 + i).toString().padStart(5, '0')}`,
      lsi: `LSI-${(48210 + idx * 7).toString().padStart(6, '0')}`,
      serviceType: SERVICE_TYPE_POOL[idx % SERVICE_TYPE_POOL.length],
      party: PARTY_POOL[idx % PARTY_POOL.length],
      status,
      implementer: IMPLEMENTER_POOL[idx % IMPLEMENTER_POOL.length],
      remarks: remarksForStatus[idx % remarksForStatus.length],
    });
  }
  return rows;
}

// ---------- Outage Communications (Outage Communications tab) ----------

const COMM_TYPE_POOL = ['Email', 'SMS', 'WhatsApp'];
const COMM_STATUS_POOL = ['Sent', 'Pending', 'Delivered', 'Failed'];
const COMM_CONTACT_TYPE_POOL = ['Party level contact', 'Customer admin', 'Internal team', 'Vendor contact'];
const COMM_JOURNEY_POOL = [
  'Planned Outage Notification', 'Planned Outage Alert', 'Planned Outage Update',
  'Outage Approval Reminder', 'Customer Admin Notification', 'Vendor Outage Notification',
];
const COMM_SENDER_POOL = [
  'cm-notifications@airtel.com', 'noc-alerts@airtel.com', 'changemgmt@airtel.com', 'vendor-coordination@airtel.com',
];
// Remarks keyed by status (not an independently-indexed pool) so a row
// never shows e.g. status "Failed" next to a remark describing success.
const COMM_REMARKS_BY_STATUS: Record<string, string[]> = {
  Sent: ['Sent to primary contact ahead of the maintenance window.', 'Dispatched to all registered recipients on schedule.'],
  Pending: ['Awaiting delivery confirmation from the gateway.', 'Queued — recipient has not yet acknowledged.'],
  Delivered: ['Acknowledged by customer admin.', 'Confirmed received; no further action needed.'],
  Failed: ['Delivery failed — invalid contact number on file, escalate to account team.', 'Bounced — mailbox unreachable, retry via alternate contact.'],
};
const COMM_TIME_POOL = [
  '18 Aug 2026, 08:05 AM', '17 Aug 2026, 09:20 PM', '17 Aug 2026, 03:10 PM',
  '16 Aug 2026, 06:45 PM', '16 Aug 2026, 11:30 AM', '15 Aug 2026, 02:55 PM',
];

function buildCommunications(outageIdSeed: number, count: number): OutageCommunicationRecord[] {
  const rows: OutageCommunicationRecord[] = [];
  for (let i = 0; i < count; i++) {
    const idx = outageIdSeed + i;
    const status = COMM_STATUS_POOL[(idx + i) % COMM_STATUS_POOL.length];
    const remarksForStatus = COMM_REMARKS_BY_STATUS[status];
    rows.push({
      type: COMM_TYPE_POOL[idx % COMM_TYPE_POOL.length],
      status,
      contactType: COMM_CONTACT_TYPE_POOL[idx % COMM_CONTACT_TYPE_POOL.length],
      journey: COMM_JOURNEY_POOL[idx % COMM_JOURNEY_POOL.length],
      triggerTime: COMM_TIME_POOL[idx % COMM_TIME_POOL.length],
      senderEmail: COMM_SENDER_POOL[idx % COMM_SENDER_POOL.length],
      remarks: remarksForStatus[idx % remarksForStatus.length],
    });
  }
  return rows;
}

// ---------- Planned Outages / CRQ page ----------

interface PoSeed {
  outageId: string; crq: string; changeType: string; impact: string; status: string;
  implementer: string; description: string; startDate: string; endDate: string; reason: string;
  category: string; activityLocation: string; benefitOfChange: string; durationInMin: string;
  requesterEmail: string; typeOfChange: string; lsiCount: number; commCount: number;
}

const PO_SEED: PoSeed[] = [
  {
    outageId: '110039400', crq: 'CRQ000005963007', changeType: 'Link shifting', impact: 'Service affecting',
    status: 'Planned', implementer: 'changemgmt@airtel.com',
    description: 'Topology modification for enterprise MPLS ring — shifting primary link from Hyderabad-POP3 to Hyderabad-POP5 for capacity augmentation.',
    startDate: '2026.08.20 - 23:00:00', endDate: '2026.08.21 - 02:00:00', reason: 'Capacity expansion',
    category: 'Planned', activityLocation: 'Hyderabad', benefitOfChange: 'To provide better services uptime in future',
    durationInMin: '180 minutes', requesterEmail: 'network.ops@airtel.com', typeOfChange: 'Internal',
    lsiCount: 3, commCount: 4,
  },
  {
    outageId: '110039398', crq: 'CRQ000006123412', changeType: 'Software upgrade', impact: 'Non-service affecting',
    status: 'In Progress', implementer: 'noc.enterprise@airtel.com',
    description: 'Firmware upgrade on core PE routers serving Bengaluru enterprise block to patch a known BGP vulnerability.',
    startDate: '2026.08.18 - 01:00:00', endDate: '2026.08.18 - 04:30:00', reason: 'Regulatory compliance',
    category: 'Emergency', activityLocation: 'Bengaluru', benefitOfChange: 'Regulatory compliance',
    durationInMin: '210 minutes', requesterEmail: 'security.ops@airtel.com', typeOfChange: 'Internal',
    lsiCount: 2, commCount: 3,
  },
  {
    outageId: '110039384', crq: 'CRQ000006123390', changeType: 'Hardware replacement', impact: 'Service affecting',
    status: 'Completed', implementer: 'fieldops.south@airtel.com',
    description: 'End-of-life line card replacement on Chennai aggregation node feeding the Ambattur industrial corridor.',
    startDate: '2026.08.17 - 22:00:00', endDate: '2026.08.18 - 00:15:00', reason: 'Hardware EOL replacement',
    category: 'Planned', activityLocation: 'Chennai', benefitOfChange: 'Improve redundancy',
    durationInMin: '135 minutes', requesterEmail: 'network.ops@airtel.com', typeOfChange: 'Internal',
    lsiCount: 4, commCount: 5,
  },
  {
    outageId: '110039376', crq: 'CRQ000006123371', changeType: 'Configuration change', impact: 'No impact',
    status: 'Rejected', implementer: 'provisioning.team@airtel.com',
    description: 'QoS policy re-mapping on Mumbai SD-WAN hub requested by customer to prioritize voice traffic.',
    startDate: '2026.08.19 - 20:00:00', endDate: '2026.08.19 - 21:00:00', reason: 'Customer request',
    category: 'Standard', activityLocation: 'Mumbai', benefitOfChange: 'Reduce network latency',
    durationInMin: '60 minutes', requesterEmail: 'customer.relations@airtel.com', typeOfChange: 'Customer',
    lsiCount: 1, commCount: 2,
  },
  {
    outageId: '110039370', crq: 'CRQ000006123365', changeType: 'Node migration', impact: 'Service affecting',
    status: 'Cancelled', implementer: 'network.ops@airtel.com',
    description: 'Migration of legacy Delhi-NCR aggregation node to new POP — cancelled pending customer change freeze.',
    startDate: '2026.08.22 - 23:30:00', endDate: '2026.08.23 - 03:00:00', reason: 'Node consolidation',
    category: 'Planned', activityLocation: 'Delhi', benefitOfChange: 'Improve redundancy',
    durationInMin: '210 minutes', requesterEmail: 'network.ops@airtel.com', typeOfChange: 'Internal',
    lsiCount: 5, commCount: 3,
  },
  {
    outageId: '110039362', crq: 'CRQ000006123349', changeType: 'Configuration change', impact: 'Service affecting',
    status: 'Scheduled', implementer: 'noc.enterprise@airtel.com',
    description: 'Emergency route re-convergence for Pune enterprise ring following a fibre cut on the primary path.',
    startDate: '2026.08.18 - 12:00:00', endDate: '2026.08.18 - 13:00:00', reason: 'Fault rectification',
    category: 'Emergency', activityLocation: 'Pune', benefitOfChange: 'To provide better services uptime in future',
    durationInMin: '60 minutes', requesterEmail: 'noc.enterprise@airtel.com', typeOfChange: 'Internal',
    lsiCount: 2, commCount: 4,
  },
  {
    outageId: '110039355', crq: 'CRQ000006123330', changeType: 'Link shifting', impact: 'Non-service affecting',
    status: 'Planned', implementer: 'fieldops.south@airtel.com',
    description: 'Secondary link rerouting for Kolkata enterprise cluster ahead of planned data-centre relocation.',
    startDate: '2026.08.25 - 21:00:00', endDate: '2026.08.25 - 23:30:00', reason: 'Preventive maintenance',
    category: 'Planned', activityLocation: 'Kolkata', benefitOfChange: 'Improve redundancy',
    durationInMin: '150 minutes', requesterEmail: 'network.ops@airtel.com', typeOfChange: 'Internal',
    lsiCount: 3, commCount: 2,
  },
  {
    outageId: '110039347', crq: 'CRQ000006123318', changeType: 'Hardware replacement', impact: 'Service affecting',
    status: 'Open', implementer: 'provisioning.team@airtel.com',
    description: 'Replacement of faulty optical transponder on Gurgaon-Manesar corridor affecting SD-WAN uplinks.',
    startDate: '2026.08.19 - 22:00:00', endDate: '2026.08.20 - 00:30:00', reason: 'Fault rectification',
    category: 'Emergency', activityLocation: 'Gurgaon', benefitOfChange: 'To provide better services uptime in future',
    durationInMin: '150 minutes', requesterEmail: 'fieldops.north@airtel.com', typeOfChange: 'Internal',
    lsiCount: 2, commCount: 3,
  },
];

function toPlannedOutage(seed: PoSeed, index: number): PlannedOutage {
  return {
    outageId: seed.outageId,
    crq: seed.crq,
    changeType: seed.changeType,
    impact: seed.impact,
    status: seed.status,
    implementer: seed.implementer,
    description: seed.description,
    startDate: seed.startDate,
    endDate: seed.endDate,
    reason: seed.reason,
    submission: 'Submitted',
    linkedLsis: buildImpactedLsis(index + 1, seed.lsiCount).map(l => l.lsi),
    impactedLsis: buildImpactedLsis(index + 1, seed.lsiCount),
    communications: buildCommunications(index + 1, seed.commCount),
    rawData: {
      'Planned Outage Id': seed.outageId,
      'Activity Location': seed.activityLocation,
      'Benefit Of Change': seed.benefitOfChange,
      Category: seed.category,
      'Change Description': seed.description,
      'Change Type': seed.changeType,
      Impact: seed.impact,
      Implementer: seed.implementer,
      'Duration in Min': seed.durationInMin,
      'Outage Reason': seed.reason,
      'Planned End Date': seed.endDate,
      'Planned Start Date': seed.startDate,
      'Requester Email Id': seed.requesterEmail,
      'Type of Change': seed.typeOfChange,
      Status: seed.status,
    },
  };
}

export function getMockCrqPageData(): CrqPageData {
  const plannedOutages: PlannedOutage[] = PO_SEED.map((seed, i) => toPlannedOutage(seed, i));
  return { plannedOutages };
}

// ---------- Dropdown values ----------

export function getMockDropdownValues(name: string): string[] {
  const fallback: Record<string, string[]> = {
    CategoryList: ['Planned', 'Emergency', 'Standard'],
    ChangeType: ['Link shifting', 'Configuration change', 'Hardware replacement', 'Software upgrade', 'Node migration'],
    Impact: ['Service affecting', 'Non-service affecting', 'No impact'],
    TypeOfChange: ['Customer', 'Internal', 'Vendor'],
    Status: ['Planned', 'Submitted', 'In Progress', 'Completed', 'Cancelled', 'Scheduled', 'Rejected'],
  };
  return fallback[name] || [];
}

// ---------- Service Impact search modal (sidebar LSI search) ----------

export function getMockServiceImpactRows(): ServiceImpactApiRow[] {
  const rows: ServiceImpactApiRow[] = [];
  const count = 84;
  for (let i = 0; i < count; i++) {
    rows.push({
      LSI: `LSI-${(4821 + i).toString().padStart(6, '0')}`,
      ServiceType: SERVICE_TYPE_POOL[i % SERVICE_TYPE_POOL.length],
      Customer: PARTY_POOL[i % PARTY_POOL.length],
    });
  }
  return rows;
}

// ---------- Write-op mock responses ----------
// Simulated success — mirrors the exact success conventions the real API
// uses (see change-management.types.ts) so downstream success/error
// branches in the components behave identically to a real successful call.

export function getMockSyncPoResponse(outageId: string): SyncPoResponse {
  return {
    StatusMessage: 'Success',
    SiebelMessage: { 'B2B Planned Outage BC': { 'Planned Outage Id': outageId } },
  };
}

export function getMockMailOutageResponse(): MailOutageResponse {
  return { StatusMessage: 'Communications sent successfully' };
}

export function getMockPoInternalResponse(): PoInternalResponse {
  return null;
}

export function getMockLinkStatusResponse(lsi: string): LinkStatusResponse {
  const lastDigit = lsi.replace(/\D/g, '').slice(-1);
  const isUp = lastDigit === '' || Number(lastDigit) % 2 === 0;
  return { status: isUp ? 'Link Up' : 'Link Down' };
}
