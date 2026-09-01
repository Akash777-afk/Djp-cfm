import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotService, QUICK_ACTIONS } from '../../services/chatbot.service';
import { ChatMessage, QuickAction } from '../../services/chatbot.types';

// Thin presentational shell — all conversation state/logic lives in
// ChatbotService (a singleton), so this component can be destroyed and
// recreated (e.g. if NocPortalComponent itself ever gets torn down) without
// losing the conversation. See ChatbotService's own header comment for the
// full rationale, including why only 2 of the 6 quick actions call a real
// service today.
@Component({
  selector: 'app-noc-chatbot',
  templateUrl: './noc-chatbot.component.html',
  styleUrls: ['./noc-chatbot.component.scss'],
})
export class NocChatbotComponent {
  constructor(public chat: ChatbotService, private router: Router) {}

  readonly quickActions: QuickAction[] = QUICK_ACTIONS;
  draft = '';

  trackByMessageId(_i: number, m: ChatMessage): string {
    return m.id;
  }

  onQuickAction(action: QuickAction): void {
    this.chat.sendQuickAction(action);
  }

  onSend(): void {
    if (!this.draft.trim()) { return; }
    this.chat.sendText(this.draft);
    this.draft = '';
  }

  onKeydown(evt: KeyboardEvent): void {
    if (evt.key === 'Enter' && !evt.shiftKey) {
      evt.preventDefault();
      this.onSend();
    }
  }

  onClearConversation(): void {
    this.chat.clearConversation();
  }

  onMessageAction(msg: ChatMessage): void {
    if (msg.actionRoute) {
      this.chat.close();
      this.router.navigate([msg.actionRoute]);
    }
  }
}
