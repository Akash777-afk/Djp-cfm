export interface AlarmBadge {
  label: string;
  count: number;
  bg: string;
  border: string;
  color: string;
}

export interface OtnSpanLossRow {
  label: string;
  value: number;
  bg: string;
  border: string;
  color: string;
}

export interface StatusField {
  label: string;
  value: string;
  bg: string;
  border: string;
  color: string;
}

export interface ProductDetailField {
  label: string;
  value: string;
}

export interface SrNotificationTab {
  key: string;
  label: string;
  count: number;
  active: boolean;
}

export interface PrimaryNavItem {
  key: string;
  label: string;
  icon: string;
}

export interface TopUtilityIcon {
  key: string;
  icon: string;
  alt: string;
  // Each source asset has its own natural design size (not uniform) —
  // forcing them into one common box is what made the call icon look
  // mismatched against the others.
  width: number;
  height: number;
}
