export type EventType =
  | 'ticket:created'
  | 'ticket:updated'
  | 'queue:reordered'
  | 'doctor:status'
  | 'reassign:proposed'
  | 'notification:new'
  | 'policy:updated';

export interface AppEvent {
  type: EventType;
  payload: any;
}

let channel: BroadcastChannel | null = null;
type Listener = (event: AppEvent) => void;
const listeners = new Set<Listener>();

export function initEventBus() {
  if (typeof window === 'undefined') return;
  if (!channel) {
    channel = new BroadcastChannel('careflow');
    channel.onmessage = (e) => {
      listeners.forEach(l => l(e.data));
    };

    // Also listen to storage events to catch localStorage updates from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('careflow_')) {
        // Broadly notify that state might have changed, or we can handle specific keys
        listeners.forEach(l => l({ type: 'ticket:updated', payload: {} }));
      }
    });
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emit(event: AppEvent) {
  if (channel) {
    channel.postMessage(event);
  }
  // Local dispatch
  listeners.forEach(l => l(event));
}
