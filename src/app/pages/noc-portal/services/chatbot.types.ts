// Shared shapes for the NOC AI Assistant. Kept in one small types file
// (matching incident-management.types.ts / change-management.types.ts's own
// convention) rather than inline in the service, since both the service and
// the component need them.

export type ChatSender = 'user' | 'ai';

// 'text' is a plain reply; the rest are dashboard-style structured replies
// (icon+label+value rows, matching the NOC Portal's own stat-tile visual
// language rather than inventing a separate chat-bubble data format).
export type ChatResponseKind =
  | 'text'
  | 'incidents'
  | 'network'
  | 'escalations'
  | 'service-requests'
  | 'alerts'
  | 'analysis';

export interface ChatStatRow {
  icon: string; // single emoji, matches the spec's own "🔴 Critical — 03" style
  label: string;
  value: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  kind: ChatResponseKind;
  text?: string;
  title?: string;
  rows?: ChatStatRow[];
  total?: { label: string; value: string };
  actionLabel?: string;
  actionRoute?: string;
  timestamp: number;
}

export interface QuickAction {
  key: ChatResponseKind;
  label: string;
  // Matches SvgLineChartComponent/CardLoadingOverlayComponent's own
  // convention of hand-drawn inline SVGs — icon keys switched on in the
  // template rather than per-action image assets, so there's nothing new to
  // add under src/assets for this.
  icon: 'incidents' | 'network' | 'escalations' | 'sr' | 'alerts' | 'analysis';
}
