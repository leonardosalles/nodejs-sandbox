## Leactor: A simulated Reactor Pattern Visualizer

This POC aims to show how Reactor Pattern works, there is a simulation of the Events and also the Demultiplexer.

## What is this?

This is a full-stack simulation of a non-blocking event-driven architecture. It’s split into three main parts:

<b>Core (leactor-core):</b> A generic simulated Dispatcher engine. It doesn't know what it’s processing,just knows how to route events to the right handlers.

<b>API:</b> An Event Generator which simulates a chaotic environment where different types of tasks (I/O, heavy math, timers) arrive at different speeds.

<b>UI:</b> A real-time dashboard built with Next.js and WebSockets that visualizes the Event Demultiplexer(the stack of things currently being handled).

## How Reactor Pattern is applied

I followed the formal Reactor Pattern structure, but kept the code clean:

<b>Resources:</b> Represented by event types: READ, WRITE, TIMER, and CPU.

<b>Synchronous Event Demultiplexer:</b> In this simulation, it's our API's main loop. It gathers simulated notified events and pushes them to the Reactor.

<b>Reactor (Dispatcher Itself):</b> Leactor class. It manages a map of handlers. When an event hits, it doesn't do the work itself, it finds the right handler and says: "You deal with this, let me know when you're done."

<b>Handlers:</b> This is where the work happens. By registering them in the API rather than hardcoding them in the core, I’ve kept the engine decoupled like in a real-world production app.

## What I learned

- How Reactor manage things considering the time of execution
- How this pattern uses a non-blocking IO strategy to manage stuffs
- The difference between events and handlers
- The difference of each event considering its type
- How to apply this pattern in other solutions
- How Node.js uses it to handle his Event Loop

## Leactor in Action

<video src="./leactor-in-action.mov" width="100%" controls autoplay muted loop>
  Your browser does not support the video tag.
</video>
