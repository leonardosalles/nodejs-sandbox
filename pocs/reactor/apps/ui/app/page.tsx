"use client";

import { useEffect, useState, useMemo, useRef } from "react";

type EventMsg = {
  kind: "start" | "end";
  event: { id: number; type: string };
  duration?: number;
};

const TYPE_COLORS: Record<string, string> = {
  READ: "text-blue-400 border-blue-500 shadow-blue-500/20",
  WRITE: "text-orange-400 border-orange-500 shadow-orange-500/20",
  TIMER: "text-yellow-400 border-yellow-500 shadow-yellow-500/20",
  CPU: "text-red-400 border-red-500 shadow-red-500/20",
};

export default function Page() {
  const [events, setEvents] = useState<EventMsg[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3001");
    wsRef.current.onmessage = (msg) => {
      const data: EventMsg = JSON.parse(msg.data);
      setEvents((prev) => {
        const next = [...prev, data];
        return next.length > 80 ? next.slice(-80) : next;
      });
    };
    return () => wsRef.current?.close();
  }, []);

  const activeEvents = useMemo(() => {
    const activeMap = new Map();
    events.forEach((e) => {
      if (e.kind === "start") activeMap.set(e.event.id, e);
      else if (e.kind === "end") activeMap.delete(e.event.id);
    });
    return Array.from(activeMap.values()) as EventMsg[];
  }, [events]);

  const completedHistory = useMemo(() => {
    return events
      .filter((e) => e.kind === "end")
      .reverse()
      .slice(0, 15);
  }, [events]);

  return (
    <main className="p-6 bg-slate-950 min-h-screen text-slate-200 flex flex-col h-screen overflow-hidden font-sans">
      <header className="mb-8 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            LEACTOR{" "}
            <span className="text-blue-500 font-light underline decoration-blue-500/30">
              MONITOR
            </span>
          </h1>
        </div>
        <div className="flex gap-3 bg-slate-900 p-1.5 px-4 rounded-full border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-green-500 self-center animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] font-mono text-green-500 font-bold uppercase tracking-tighter">
            CONNECTED
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <section className="lg:col-span-3 space-y-6 flex flex-col min-h-0">
          <div className="grid grid-cols-4 gap-4">
            {["READ", "WRITE", "TIMER", "CPU"].map((type) => {
              const count = activeEvents.filter(
                (ae) => ae.event.type === type
              ).length;
              const isActive = count > 0;
              const colorClass =
                TYPE_COLORS[type] || "text-slate-400 border-slate-800";

              return (
                <div
                  key={type}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? `bg-slate-900 ${colorClass.split(" ")[1]} shadow-lg`
                      : "bg-slate-900/50 border-slate-800 opacity-30"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      isActive ? colorClass.split(" ")[0] : "text-slate-500"
                    }`}
                  >
                    {type}
                  </p>
                  <p
                    className={`text-4xl font-black transition-all duration-500 ${
                      isActive ? "text-white scale-110" : "text-slate-700"
                    }`}
                  >
                    {count}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col min-h-0">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-[0.2em]">
              Synchronous Event Demultiplexer (Stack)
            </h2>
            <div className="flex flex-wrap gap-2 content-start overflow-y-auto pr-2 custom-scrollbar">
              {activeEvents.map((ae) => (
                <div
                  key={ae.event.id}
                  className={`border px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-2 animate-in zoom-in duration-300 ${TYPE_COLORS[
                    ae.event.type
                  ]
                    .split(" ")
                    .slice(0, 2)
                    .join(" ")} bg-slate-900/80`}
                >
                  <div
                    className={`w-1 h-1 rounded-full animate-ping bg-current`}
                  />
                  {ae.event.type}_{ae.event.id}
                </div>
              ))}
              {activeEvents.length === 0 && (
                <span className="text-slate-700 text-xs italic font-light">
                  Reactor idle. Awaiting next event loop cycle...
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col min-h-0 shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
            <h2 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Event History
            </h2>
            <span className="text-[12px] font-mono text-slate-600">
              Latest 15
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {completedHistory.map((e) => (
              <div
                key={`${e.event.id}-${e.kind}`}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 animate-in slide-in-from-right-4 duration-500 ease-out"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono text-slate-500">
                    ID_{e.event.id}
                  </span>
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-900 ${
                      TYPE_COLORS[e.event.type]?.split(" ")[0]
                    }`}
                  >
                    {e.event.type}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-emerald-500/80 flex items-center justify-between">
                  <span>RESOLVED</span>
                  <span className="text-yellow-600 font-mono">
                    {e.duration?.toFixed(0)}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
