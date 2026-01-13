import express from "express";
import { WebSocketServer } from "ws";
import { Leactor } from "@leactor/core";

const app = express();
const server = app.listen(3001);
const wss = new WebSocketServer({ server });

const leactor = new Leactor();
let counter = 0;

leactor.register("READ", {
  handle: async () => {
    await new Promise((r) => setTimeout(r, 50));
  },
});

wss.on("connection", (ws) => {
  const emit = (e: any) => ws.send(JSON.stringify(e));

  setInterval(async () => {
    await leactor.dispatch({ id: counter++, type: "READ" }, emit);
  }, 100);
});

console.log("API running on :3001");
