import {
  AlarmBadge, OtnSpanLossRow, PrimaryNavItem, ProductDetailField,
  SrNotificationTab, StatusField, TopUtilityIcon,
} from './noc-portal.types';
import { SidebarNavItem } from '../CM/components/sidebar-nav/sidebar-nav.component';

const A = '/assets/noc-portal';

export const PROFILE = {
  name: 'Sam Raechell',
  lsiTag: 'LSI#004821',
  bank: 'Himachal Pradesh Gramin Bank',
  phone: '+1 (555) 123-4567',
  email: 'sam@example.com',
};

export const NETWORK_ALARMS: AlarmBadge[] = [
  { label: 'Critical', count: 3,  bg: '#fee2e2', border: 'rgba(185, 28, 28, 0.21)', color: '#b91c1c' },
  { label: 'Major',    count: 7,  bg: '#ffedd5', border: 'rgba(194, 65, 12, 0.23)', color: '#c2410c' },
  { label: 'Minor',    count: 12, bg: 'rgba(111, 206, 111, 0.24)', border: 'rgba(6, 67, 11, 0.08)', color: '#06430b' },
];

export const THRESHOLD_ALARMS: AlarmBadge[] = [
  { label: 'Critical', count: 1, bg: '#fee2e2', border: 'rgba(185, 28, 28, 0.21)', color: '#b91c1c' },
  { label: 'Major',    count: 4, bg: '#ffedd5', border: 'rgba(194, 65, 12, 0.23)', color: '#c2410c' },
  { label: 'Minor',    count: 8, bg: 'rgba(111, 206, 111, 0.24)', border: 'rgba(6, 67, 11, 0.08)', color: '#06430b' },
];

export const OTN_SPAN_LOSS: OtnSpanLossRow[] = [
  { label: 'Very High', value: 9, bg: '#ffedd5', border: '#ffd49b', color: '#c2410c' },
  { label: 'Critical',  value: 5, bg: '#fee2e2', border: '#ffc5c5', color: '#b91c1c' },
  { label: 'Medium',    value: 0, bg: 'rgba(255, 234, 0, 0.19)', border: '#ffea00', color: '#958800' },
];

export const STATUS_FIELDS: StatusField[] = [
  { label: 'ECRM Status',      value: 'Active',    bg: 'rgba(21, 128, 61, 0.11)', border: 'rgba(4, 143, 56, 0.3)',   color: '#15803d' },
  { label: 'Link Status',      value: 'Link Down', bg: '#faf7f5', border: 'rgba(185, 28, 28, 0.3)', color: '#b91c1c' },
  { label: 'Outage',           value: 'No',        bg: '#f1f5f9', border: 'rgba(0, 0, 0, 0.14)', color: '#475569' },
  { label: 'Planned Active',   value: 'NA',        bg: '#faf7f5', border: '#e6b5b4',              color: '#b91c1c' },
  { label: 'Over utilization', value: 'No',        bg: '#f1f5f9', border: 'rgba(0, 0, 0, 0.07)', color: '#475569' },
  { label: 'Tierone LSI',      value: 'Link Down', bg: '#faf7f5', border: 'rgba(185, 28, 28, 0.3)', color: '#b91c1c' },
];

export const PRODUCT_DETAILS: ProductDetailField[] = [
  { label: 'Product name',    value: 'SD WAN' },
  { label: 'Platform',        value: 'RF' },
  { label: 'City',            value: 'SD WAN' },
  { label: 'SI name',         value: '99999' },
  { label: 'Customer seg.',   value: 'RF' },
  { label: 'ENOC handover',   value: 'ENOC' },
  { label: 'Bandwidth',       value: '256.00 Kbps' },
  { label: 'Service seg.',    value: 'Development' },
  { label: 'Activation date', value: '09.06.2025' },
];

export const SR_NOTIFICATION_TABS: SrNotificationTab[] = [
  { key: 'ufo',        label: 'UFO',        count: 0, active: false },
  { key: 'fuc',        label: 'FUC',        count: 0, active: false },
  { key: 'suc',        label: 'SUC',        count: 0, active: false },
  { key: 'pwc',        label: 'PWC',        count: 1, active: true  },
  { key: 'tp-factory', label: 'TP/Factory', count: 0, active: false },
];

export const NAV_ITEMS: PrimaryNavItem[] = [
  { key: 'topology',            label: 'Topology',            icon: `${A}/topology.svg` },
  { key: 'link-status',         label: 'Link status',         icon: `${A}/link.svg` },
  { key: 'inventory-blueprint', label: 'Inventory blue',      icon: `${A}/invent.svg` },
  { key: 'performance',         label: 'Performance',         icon: `${A}/perfoemance.svg` },
  { key: 'ai-insights',         label: 'AI Insights',         icon: `${A}/Aiinsights.svg` },
  { key: 'bundle-summary',      label: 'Bundle Summary',      icon: `${A}/Frame 427319839.svg` },
];

export const TOP_UTILITY_ICONS: TopUtilityIcon[] = [
  { key: 'analytics', icon: `${A}/majesticons_analytics-line.svg`,        alt: 'NAMO',                 width: 42, height: 42 },
  { key: 'call',      icon: `${A}/tdesign_call.svg`,                      alt: 'Airtel IQ',            width: 36, height: 36 },
  { key: 'network',   icon: `${A}/fluent-mdl2_my-network.svg`,            alt: 'NMS',                  width: 39, height: 39 },
  { key: 'knowledge', icon: `${A}/Knowledgemmt.svg`,                      alt: 'Knowledge management', width: 39, height: 39 },
];

// Same sidebar shell as Change Management (dashboard + LSI search
// unchanged); only the bottom three icons are NOC Portal-specific.
// Icon assets for slots 3 and 5 are swapped from the original order
// (Frame 427319855 now sits in slot 3, Frame 427319853 in slot 5).
export const NOC_SIDEBAR_ITEMS: SidebarNavItem[] = [
  { key: 'dashboard',             label: 'Dashboard',         icon: 'dashboard' },
  { key: 'lsi-search',            label: 'LSI Search',        icon: 'search' },
  { key: 'noc-feedback',          label: 'Feedback',          icon: 'img', iconSrc: `${A}/Frame 427319855.svg` },
  { key: 'noc-escalation-matrix', label: 'Escalation matrix', icon: 'img', iconSrc: `${A}/Frame 427319854.svg` },
  { key: 'noc-logout',            label: 'Logout',            icon: 'img', iconSrc: `${A}/Frame 427319853.svg` },
];

export const ASSET = A;

// SR Journey Summary, FLT Observation / Expected Root Cause (Crystalized
// RCA), and both SR Insights cards are all backend-driven now — see
// services/sr-details.service.ts + services/sr-details.mock.ts, not this
// file. This file only holds data that isn't tied to a specific searched SR.
