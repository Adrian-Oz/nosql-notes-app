# Electron Integration Branch – Offline Desktop Prototype

This branch contains an experimental Electron desktop integration of the Task Board application.

It introduces embedded NoSQL persistence, hydration discipline, and portable Windows distribution while preserving a clean separation between infrastructure and domain logic.

---

# 🚧 Branch Purpose

This branch exists as an architectural experiment and milestone.

It is intentionally **not merged into `main`**.

Goals of this branch:

* Integrate Electron with existing React + Zustand frontend
* Implement embedded local persistence using PouchDB
* Enforce hydration discipline before UI rendering
* Introduce snapshot-based auto-save architecture
* Produce a portable Windows executable build

The `main` branch remains the stable web-only version.

---

# 🧠 Architecture Overview

## Process Boundaries

Renderer (React + Zustand)
→ IPC bridge
→ Electron Main
→ PouchDB (embedded)
→ Disk (userData directory)

### Authority Model

* Disk = Source of truth
* Main process = Infrastructure + database adapter
* Renderer = Domain logic + UI

Renderer never accesses the database directly.
Main never enforces domain validation.

---

# 💾 Persistence Model

## Storage Engine

* PouchDB (file-backed, embedded)
* No external services
* No MongoDB server
* Fully offline-first

## Snapshot Model

Single document pattern:

```ts
{
  _id: "main-board",
  type: "board-snapshot",
  snapshot: Board,
  updatedAt: string
}
```

* No normalization
* No collections per entity
* Full snapshot overwrite on save

This keeps the demo simple and predictable.

---

# 🔄 Hydration Discipline

The store initializes with:

* `board: null`
* `isHydrated: false`

Boot sequence:

1. Load snapshot from disk
2. Validate runtime shape
3. Hydrate Zustand store
4. Block UI rendering until hydrated

StrictMode-safe guard prevents double execution in development.

---

# 🔐 Runtime Snapshot Validation

Before hydration, snapshot is validated to prevent corrupted or malformed state from crashing the UI.

If invalid:

* A new empty board is created
* Snapshot is replaced

This protects against manual DB tampering or incomplete data.

---

# ♻️ Auto-Save Strategy

Auto-save implemented using Zustand subscription:

* Subscribes to `board` changes
* Guarded by `isHydrated`
* Debounced (≈400ms) to prevent IPC flooding during drag-and-drop
* Saves via IPC to Electron main process

This ensures:

* No save before hydration
* No duplicate StrictMode writes
* Reduced disk churn during DnD operations

---

# 🖥 Portable Distribution

Built using `electron-builder`.

Target:

* Windows Portable (x64)

Build command:

```
npm run dist
```

Output:

```
release/Task Board Portable.exe
```

The executable:

* Requires no installation
* Stores data in `app.getPath("userData")`
* Runs fully offline

---

# 📁 Important Folders

```
dist/              → Vite production build
 dist-electron/     → Compiled Electron main process
 release/           → Packaged portable builds
```

These folders are excluded from Git.

---

# ⚠️ Windows SmartScreen Notice

The portable executable is unsigned.

Windows may show a security warning because the application is not code signed.

This is expected behavior for indie Electron applications.

---

# 🎓 Post-Demo Learning Topics

After demo completion, this branch will be revisited to deeply study:

* IPC-based persistence architecture
* Hydration timing and temporal state discipline
* StrictMode-safe boot logic
* Subscription-based auto-save patterns
* Snapshot validation strategies
* Embedded database lifecycle management

This branch serves as both a working prototype and a learning reference.

---

# 🧪 Status

Electron integration: Complete
Embedded persistence: Stable
Hydration discipline: Implemented
Portable distribution: Working

This branch represents a functional offline desktop prototype of the Task Board application.

---


