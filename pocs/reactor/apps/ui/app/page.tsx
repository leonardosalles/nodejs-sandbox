
'use client';

import { useEffect, useState } from 'react';

type EventMsg = {
  kind: 'start' | 'end';
  event: { id: number; type: string };
  duration?: number;
};

export default function Page() {
  const [events, setEvents] = useState<EventMsg[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = msg => {
      setEvents(e => [...e.slice(-50), JSON.parse(msg.data)]);
    };
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Reactor Pattern Visualizer</h1>
      <ul className="mt-4 space-y-1">
        {events.map((e, i) => (
          <li key={i} className="text-sm">
            {e.kind} #{e.event.id} {e.duration && `(${e.duration.toFixed(1)}ms)`}
          </li>
        ))}
      </ul>
    </main>
  );
}
