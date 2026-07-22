# SafeGauge — React Take-Home: Sensor Portal

**Time budget:** 4–5 hours. We are not looking for a finished product — we want to see how you
structure a real app: authentication, CRUD against an API, and a live real-time view, with honest
handling of loading, error, and empty states.

## Context

SafeGauge builds sensor systems for heavy industry. Operators log into a **portal** to manage their
devices, configure alert rules, and watch live readings. You will build a slice of that portal
against two mock modules we provide. **Use them as-is; do not modify them.**

- `mock-api.js` — the portal REST API (auth + devices + alert-rules CRUD). Global `Api`, or
  `import { Api } from './mock-api.js'`. Every call is async, has realistic latency, and
  **occasionally fails with a transient 500 — handle it.**
- `sensor-sdk.min.js` — the live telemetry stream (global `SensorHub`). One device streams up to
  **12 sensors** (pressure PT-xx / temperature TT-xx).

Read the doc header at the top of **both** files before you start — they document the full API,
the data shapes, and the error contract.

## What to build

### 1. Auth

- A **login screen**. Credentials: `admin` / `safegauge` (full access) and `viewer` / `readonly`
  (read-only — writes are rejected 403; surface that gracefully).
- Persist the session so a refresh doesn't log the user out.
- A **401 from any call** means the token is dead → send the user back to login. Handle it globally.
- A way to **log out**.

### 2. Devices (CRUD)

- List the user's devices (`Api.devices.*`). Each has `name`, `site`, `sensorCount`.
- **Create, edit, delete** a device. Deleting cascades its rules — reflect that in the UI.
- Validation errors come back as `422` with a `.body` map of field → message. Show them inline on
  the form, don't just toast a generic error.

### 3. Alert Rules (CRUD)

- For a selected device, list / create / edit / delete alert rules (`Api.rules.*`).
- A rule = `{ sensorId, op:'>'|'<', threshold, severity:'warn'|'critical' }`.

### 4. Live dashboard

- For a selected device, connect the `SensorHub` and show a **live grid** — one tile per sensor:
  id, type, latest value + unit, and a "last updated" indication. Tiles update in real time.
- Surface connection status (`connected` / `reconnecting` / `disconnected`) clearly. Reconnect
  blips happen — handle them gracefully.
- **Apply the alert rules to the live stream:** highlight any tile whose latest reading breaches a
  rule the user configured (e.g. `PT-01 > 5000`), coloured by severity.
- **No leaks** — unsubscribe listeners and clear timers on unmount / disconnect / device switch.

### 5. Tests

- **At least two meaningful tests.** Pick things worth testing — e.g. a rule-evaluation helper, the
  401-handling path, or a CRUD flow. `Api._reset()` restores seeded state for test setup, and
  `Api._setFailRate(0)` disables the random transient failures so integration tests are deterministic.

### 6. README

- How to run it, and a few lines on the decisions / trade-offs you made in the time.

## Stack

React (Vite / CRA / Next — your choice). TypeScript welcome, not required. Any styling
(plain CSS, Tailwind, MUI). A state/data lib (Redux, Zustand, React Query) is fine but **not**
required — plain hooks are perfectly acceptable. Keep it clean, not fancy.

## Deliverable

A git repository (link or zip) **with its commit history intact**, plus the README. We look at how
the work evolved, not just the final state.

## On using AI

**You may use AI tools (Copilot, Cursor, ChatGPT, Claude, etc.)**
If you do, add a short note in your README: which tool(s) and roughly where (scaffolding, a
component, tests, debugging…). That's it. We care about an **honest account of your process** —
not whether AI was involved. A clear "I used X for Y" reflects well; an inaccurate account does not.

## What we're assessing

Auth + session handling, CRUD with real validation/error/loading/empty states, real-time state
management and cleanup, applying config to a live stream, a couple of sensible tests, readable
component structure, and a clear README. **Partial-but-clean beats rushed-and-broken** — if you run
short on time, do fewer things well and say what you'd do next in the README.
