import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentManagementService } from '../../IM/services/incident-management.service';
import { EscalationMatrixService } from '../../EM/services/escalation-matrix.service';
import { ChatMessage, ChatResponseKind, ChatStatRow, QuickAction } from './chatbot.types';

export const QUICK_ACTIONS: QuickAction[] = [
  { key: 'incidents', label: 'Check Active Incidents', icon: 'incidents' },
  { key: 'network', label: 'Network Status', icon: 'network' },
  { key: 'escalations', label: 'View Escalations', icon: 'escalations' },
  { key: 'service-requests', label: 'Check Service Requests', icon: 'sr' },
  { key: 'alerts', label: 'Show Recent Alerts', icon: 'alerts' },
  { key: 'analysis', label: 'Analyze NOC Data', icon: 'analysis' },
];
@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  constructor(
    private imService: IncidentManagementService,
    private emService: EscalationMatrixService,
  ) {
    // One-time proactive nudge shortly after the assistant becomes
    // available — there's no real push/notification source to wire this to
    // yet, so it's a single simulated trigger (not a poll loop), just
    // enough to demonstrate the pulse-ring affordance the spec calls for.
    setTimeout(() => {
      if (!this.isOpen) { this.hasUnread = true; }
    }, 4000);
  }

  isOpen = false;
  isMinimized = false;
  isThinking = false;
  hasUnread = false;
  messages: ChatMessage[] = [];

  open(): void {
    this.isOpen = true;
    this.isMinimized = false;
    this.hasUnread = false;
  }

  close(): void {
    this.isOpen = false;
  }

  minimize(): void {
    this.isMinimized = true;
  }

  restore(): void {
    this.isMinimized = false;
  }

  clearConversation(): void {
    this.messages = [];
    this.isThinking = false;
  }

  sendQuickAction(action: QuickAction): void {
    this.pushUser(action.label);
    this.thinkThen(this.buildResponse(action.key));
  }

  sendText(raw: string): void {
    const text = raw.trim();
    if (!text) { return; }
    this.pushUser(text);
    this.thinkThen(this.buildResponse(this.classify(text)));
  }

  private pushUser(text: string): void {
    this.messages.push({ id: this.uid(), sender: 'user', kind: 'text', text, timestamp: Date.now() });
  }
  private thinkThen(response$: Observable<ChatMessage>): void {
    this.isThinking = true;
    const startedAt = Date.now();
    const minThinkMs = 850;
    response$.subscribe(msg => {
      const remaining = minThinkMs - (Date.now() - startedAt);
      setTimeout(() => {
        this.messages.push(msg);
        this.isThinking = false;
      }, Math.max(0, remaining));
    });
  }

  private classify(text: string): ChatResponseKind {
    const t = text.toLowerCase();
    if (/incident/.test(t)) { return 'incidents'; }
    if (/network|status/.test(t)) { return 'network'; }
    if (/escalat/.test(t)) { return 'escalations'; }
    if (/service request|\bsr\b|request/.test(t)) { return 'service-requests'; }
    if (/alert/.test(t)) { return 'alerts'; }
    if (/analy|insight|trend/.test(t)) { return 'analysis'; }
    return 'text';
  }

  private buildResponse(kind: ChatResponseKind): Observable<ChatMessage> {
    switch (kind) {
      case 'incidents': return this.incidentsResponse();
      case 'network': return this.networkResponse();
      case 'escalations': return this.escalationsResponse();
      case 'service-requests': return this.serviceRequestsResponse();
      case 'alerts': return this.alertsResponse();
      case 'analysis': return this.analysisResponse();
      default: return this.fallbackResponse();
    }
  }

  // ---------- Real-data responses ----------

  private incidentsResponse(): Observable<ChatMessage> {
    return this.imService.getDashboardData().pipe(map(({ statTiles }) => {
      const byKey = new Map(statTiles.map(t => [t.key, t.value]));
      const val = (k: string) => byKey.get(k) ?? '0';
      const rows: ChatStatRow[] = [
        { icon: '🔴', label: 'Escalated', value: val('escalated'), color: '#e60012' },
        { icon: '🔵', label: 'In Progress', value: val('in-progress'), color: '#2563eb' },
        { icon: '🟣', label: 'Assigned', value: val('assigned'), color: '#8b5cf6' },
        { icon: '🟢', label: 'Resolved', value: val('resolved'), color: '#16a34a' },
      ];
      return this.aiMessage({
        kind: 'incidents',
        title: 'Active Incidents',
        rows,
        total: { label: 'Total', value: val('all') },
        actionLabel: 'View Incidents',
        actionRoute: '/incident-management',
      });
    }));
  }

  private escalationsResponse(): Observable<ChatMessage> {
    return this.emService.getDashboardData().pipe(map(({ levelTiles }) => {
      const byKey = new Map(levelTiles.map(t => [t.key, t.value]));
      const rows: ChatStatRow[] = [1, 2, 3].map(n => ({
        icon: n === 1 ? '🟢' : n === 2 ? '🟡' : '🟠',
        label: `Level ${n}`,
        value: String(byKey.get(`level-${n}`) ?? 0),
        color: n === 1 ? '#16a34a' : n === 2 ? '#eab308' : '#f97316',
      }));
      return this.aiMessage({
        kind: 'escalations',
        title: 'Escalations Overview',
        rows,
        total: { label: 'Total Escalated SRs', value: String(byKey.get('all') ?? 0) },
        actionLabel: 'View Escalation Matrix',
        actionRoute: '/escalation-matrix',
      });
    }));
  }

  // ---------- Representative-data responses ----------
  // No real "network status" / "SR summary count" / "alerts feed" API
  // exists anywhere in this codebase yet — same situation
  // HealthIndexService documented for the LSI charts. Swapping any of these
  // for a real call later is a one-line change inside that method only.

  private networkResponse(): Observable<ChatMessage> {
    return of(this.aiMessage({
      kind: 'network',
      title: 'Network Status',
      rows: [
        { icon: '🟢', label: 'Overall Network', value: 'Stable', color: '#16a34a' },
        { icon: '🟠', label: 'Affected Areas', value: '02', color: '#f97316' },
        { icon: '🔴', label: 'Active Alerts', value: '07', color: '#e60012' },
        { icon: '🟣', label: 'Critical Events', value: '01', color: '#8b5cf6' },
      ],
      actionLabel: 'Open NOC Portal',
    }));
  }

  private serviceRequestsResponse(): Observable<ChatMessage> {
    return of(this.aiMessage({
      kind: 'service-requests',
      title: 'Service Requests',
      rows: [
        { icon: '🟡', label: 'Open', value: '19', color: '#eab308' },
        { icon: '🔵', label: 'In Progress', value: '12', color: '#2563eb' },
        { icon: '🟢', label: 'Resolved Today', value: '31', color: '#16a34a' },
      ],
      total: { label: 'Total Active', value: '31' },
      actionLabel: 'Search Service Requests',
    }));
  }

  private alertsResponse(): Observable<ChatMessage> {
    return of(this.aiMessage({
      kind: 'alerts',
      title: 'Recent Alerts',
      rows: [
        { icon: '🔴', label: 'Threshold breach — OTN Span Loss', value: '2m ago', color: '#e60012' },
        { icon: '🟠', label: 'Bandwidth spike — Core Link 3', value: '18m ago', color: '#f97316' },
        { icon: '🟡', label: 'Latency warning — WAN 2', value: '41m ago', color: '#eab308' },
      ],
      actionLabel: 'View All Alerts',
    }));
  }

  private analysisResponse(): Observable<ChatMessage> {
    return of(this.aiMessage({
      kind: 'analysis',
      title: 'NOC Data Analysis',
      text: 'Based on current activity, incident volume is trending normal with escalations concentrated at Level 1-2. No abnormal spikes detected in the last monitoring window.',
      actionLabel: 'View Full Dashboard',
    }));
  }

  private fallbackResponse(): Observable<ChatMessage> {
    return of(this.aiMessage({
      kind: 'text',
      text: "I can help with active incidents, network status, escalations, service requests, recent alerts, or a quick NOC data analysis — try one of the quick actions below, or ask me directly.",
    }));
  }

  private aiMessage(partial: Omit<ChatMessage, 'id' | 'sender' | 'timestamp'>): ChatMessage {
    return { id: this.uid(), sender: 'ai', timestamp: Date.now(), ...partial };
  }

  private uid(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
