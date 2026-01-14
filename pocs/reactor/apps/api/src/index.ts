import express from "express";
import { WebSocketServer } from "ws";
import { Leactor, EventType } from "@leactor/core";

const app = express();
const server = app.listen(3001);
const wss = new WebSocketServer({ server });

const leactor = new Leactor();
let counter = 0;

leactor.register("READ", {
  handle: async () => {
    await new Promise((r) => setTimeout(r, 800));
  },
});

leactor.register("CPU", {
  handle: async () => {
    await new Promise((r) => setTimeout(r, 2000));
  },
});

leactor.register("WRITE", {
  handle: async () => {
    await new Promise((r) => setTimeout(r, 1500));
  },
});

leactor.register("TIMER", {
  handle: async () => {
    await new Promise((r) => setTimeout(r, 400));
  },
});

wss.on("connection", (ws) => {
  console.log("Client connected");
  const emit = (e: any) => ws.send(JSON.stringify(e));

  const interval = setInterval(() => {
    const types: EventType[] = ["READ", "CPU", "WRITE", "TIMER"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const event = { id: counter++, type: randomType };

    leactor.dispatch(event, emit).catch(console.error);
  }, 600);

  ws.on("close", () => clearInterval(interval));
});

console.log("API running on port 3001");
