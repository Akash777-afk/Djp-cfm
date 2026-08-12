import { WorkNote } from '../components/work-notes/work-notes.component';

// Mock data for WorkNotesService — stands in for a real "GET /work-notes"
// API response, same convention as sr-details.mock.ts. 16 rows (not just
// the 6 the reference screenshot shows) so pagination has real substance to
// page through rather than always landing on a single page.
export const MOCK_WORK_NOTES: WorkNote[] = [
  { id: 'wn-1',  description: null, createdAt: '2026-03-05 14:32:15', oumId: 'OUM-2024-001', resourceName: 'John Anderson',   noteType: 'Automation',              firstAcknowledgeTime: '11.11.2025 - 04:13', srStatus: 'In Progress' },
  { id: 'wn-2',  description: 'Automated ticket routing completed successfully', createdAt: '2026-03-05 13:15:42', oumId: 'OUM-2024-002', resourceName: 'Sarah Mitchell',  noteType: 'Automation',              firstAcknowledgeTime: '11.11.2025 - 04:13', srStatus: 'In Progress' },
  { id: 'wn-3',  description: null, createdAt: '2026-03-05 11:48:23', oumId: 'OUM-2024-003', resourceName: 'Michael Chen',    noteType: 'Customer Communication',  firstAcknowledgeTime: '10.11.2025 - 22:07', srStatus: 'Resolved' },
  { id: 'wn-4',  description: 'Customer contacted via email regarding SR status update', createdAt: '2026-03-05 10:22:11', oumId: 'OUM-2024-004', resourceName: 'Emily Rodriguez', noteType: 'Customer Communication',  firstAcknowledgeTime: '10.11.2025 - 19:41', srStatus: 'In Progress' },
  { id: 'wn-5',  description: null, createdAt: '2026-03-05 09:05:37', oumId: 'OUM-2024-005', resourceName: 'David Park',      noteType: 'Automation',              firstAcknowledgeTime: '10.11.2025 - 15:02', srStatus: 'Pending' },
  { id: 'wn-6',  description: 'Escalation workflow triggered for high severity SR', createdAt: '2026-03-04 16:44:58', oumId: 'OUM-2024-006', resourceName: 'Lisa Thompson',   noteType: 'Automation',              firstAcknowledgeTime: '09.11.2025 - 11:28', srStatus: 'In Progress' },
  { id: 'wn-7',  description: 'Manual verification of circuit continuity performed on-site', createdAt: '2026-03-04 14:12:03', oumId: 'OUM-2024-007', resourceName: 'Rahul Verma',     noteType: 'Manual',                  firstAcknowledgeTime: '09.11.2025 - 09:55', srStatus: 'Resolved' },
  { id: 'wn-8',  description: null, createdAt: '2026-03-04 11:30:44', oumId: 'OUM-2024-008', resourceName: 'Priya Nair',      noteType: 'Airtel Works',            firstAcknowledgeTime: '08.11.2025 - 20:16', srStatus: 'In Progress' },
  { id: 'wn-9',  description: 'Field engineer dispatched via Airtel Works portal', createdAt: '2026-03-04 09:18:29', oumId: 'OUM-2024-009', resourceName: 'Arjun Mehta',     noteType: 'Airtel Works',            firstAcknowledgeTime: '08.11.2025 - 14:33', srStatus: 'Pending' },
  { id: 'wn-10', description: 'Customer confirmed service restoration over call', createdAt: '2026-03-03 17:52:10', oumId: 'OUM-2024-010', resourceName: 'Neha Gupta',      noteType: 'Customer Communication',  firstAcknowledgeTime: '08.11.2025 - 08:47', srStatus: 'Resolved' },
  { id: 'wn-11', description: null, createdAt: '2026-03-03 15:09:37', oumId: 'OUM-2024-011', resourceName: 'Karan Malhotra',  noteType: 'Automation',              firstAcknowledgeTime: '07.11.2025 - 21:19', srStatus: 'In Progress' },
  { id: 'wn-12', description: 'Manual root cause analysis added by NOC engineer', createdAt: '2026-03-03 12:41:58', oumId: 'OUM-2024-012', resourceName: 'Ananya Iyer',     noteType: 'Manual',                  firstAcknowledgeTime: '07.11.2025 - 16:02', srStatus: 'In Progress' },
  { id: 'wn-13', description: null, createdAt: '2026-03-03 10:03:21', oumId: 'OUM-2024-013', resourceName: 'Vikram Rao',      noteType: 'Automation',              firstAcknowledgeTime: '07.11.2025 - 10:38', srStatus: 'Pending' },
  { id: 'wn-14', description: 'Airtel Works ticket closed after successful field visit', createdAt: '2026-03-02 18:27:05', oumId: 'OUM-2024-014', resourceName: 'Divya Krishnan',  noteType: 'Airtel Works',            firstAcknowledgeTime: '06.11.2025 - 23:51', srStatus: 'Resolved' },
  { id: 'wn-15', description: 'Customer notified of planned maintenance window', createdAt: '2026-03-02 14:55:49', oumId: 'OUM-2024-015', resourceName: 'Rohan Kapoor',    noteType: 'Customer Communication',  firstAcknowledgeTime: '06.11.2025 - 17:24', srStatus: 'In Progress' },
  { id: 'wn-16', description: null, createdAt: '2026-03-02 08:36:12', oumId: 'OUM-2024-016', resourceName: 'Simran Kaur',     noteType: 'Automation',              firstAcknowledgeTime: '06.11.2025 - 09:10', srStatus: 'Resolved' },
];
