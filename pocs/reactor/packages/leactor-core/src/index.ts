export type EventType = "READ" | "WRITE" | "TIMER" | "CPU";

export interface LeactorEvent {
  id: number;
  type: EventType;
}

export interface EventHandler {
  handle(event: LeactorEvent): Promise<void> | void;
}

export class Leactor {
  private handlers = new Map<EventType, EventHandler>();

  register(type: EventType, handler: EventHandler) {
    this.handlers.set(type, handler);
  }

  async dispatch(event: LeactorEvent, emit: (e: any) => void) {
    const handler = this.handlers.get(event.type);
    if (!handler) return;

    const start = performance.now();
    emit({ kind: "start", event });

    await handler.handle(event);

    emit({
      kind: "end",
      event,
      duration: performance.now() - start,
    });
  }
}
