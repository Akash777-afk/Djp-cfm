import {
  AlarmBadge, OtnSpanLossRow, PrimaryNavItem, ProductDetailField,
  SrNotificationTab, StatusField, TopUtilityIcon,
} from './noc-portal.types';
import { SidebarNavItem } from '../change-management/shared/sidebar-nav/sidebar-nav.component';

const A = '/assets/NOC_Portal';

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
  { label: 'Critical',  value: 5, bg: '#fee2e2', border: '#ffc5c5', color: '#b91c1c' },
  { label: 'Very High', value: 9, bg: '#ffedd5', border: '#ffd49b', color: '#c2410c' },
];

export const STATUS_FIELDS: StatusField[] = [
  { label: 'ECRM Status',      value: 'Active',    bg: 'rgba(21, 128, 61, 0.11)', border: 'rgba(4, 143, 56, 0.3)',   color: '#15803d' },
  { label: 'Link Status',      value: 'Link Down', bg: 'rgba(210, 179, 163, 0.11)', border: 'rgba(185, 28, 28, 0.3)', color: '#b91c1c' },
  { label: 'Outage',           value: 'No',        bg: '#f1f5f9', border: 'rgba(0, 0, 0, 0.14)', color: '#475569' },
  { label: 'Planned Active',   value: 'NA',        bg: '#faf7f5', border: '#e6b5b4',              color: '#b91c1c' },
  { label: 'Over utilization', value: 'No',        bg: '#f1f5f9', border: 'rgba(0, 0, 0, 0.07)', color: '#475569' },
  { label: 'Tierone LSI',      value: 'Link Down', bg: 'rgba(210, 179, 163, 0.11)', border: 'rgba(185, 28, 28, 0.3)', color: '#b91c1c' },
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
  { key: 'analytics', icon: `${A}/majesticons_analytics-line.svg`,        alt: 'Analytics',        width: 42, height: 42 },
  { key: 'call',      icon: `${A}/tdesign_call.svg`,                      alt: 'Call',             width: 36, height: 36 },
  { key: 'network',   icon: `${A}/fluent-mdl2_my-network.svg`,            alt: 'Network',          width: 39, height: 39 },
  { key: 'knowledge', icon: `${A}/carbon_ibm-watson-knowledge-studio.svg`, alt: 'Knowledge studio', width: 42, height: 42 },
];

// Same sidebar shell as Change Management (dashboard + LSI search
// unchanged); only the bottom three icons are NOC Portal-specific.
export const NOC_SIDEBAR_ITEMS: SidebarNavItem[] = [
  { key: 'dashboard',    label: 'Dashboard',  icon: 'dashboard' },
  { key: 'lsi-search',   label: 'LSI Search', icon: 'search' },
  { key: 'noc-alerts',   label: 'Alerts',     icon: 'img', iconSrc: `${A}/Frame 427319853.svg` },
  { key: 'noc-insights', label: 'Insights',   icon: 'img', iconSrc: `${A}/Frame 427319854.svg` },
  { key: 'noc-reports',  label: 'Reports',    icon: 'img', iconSrc: `${A}/Frame 427319855.svg` },
];

export const ASSET = A;
