import React, { useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider, Link, NavLink, Outlet } from "react-router-dom";

// ---- Types ----
type Status = "Open" | "In Progress" | "Closed";
type Priority = "Low" | "Medium" | "High";

interface Ticket {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;
  createdAt: string; // ISO
}

// ---- Seed Data ----
const seed: Ticket[] = [
  { id: "T-1001", title: "Login bug on /auth", status: "Open", priority: "High", assignee: "Alex", createdAt: "2025-10-30" },
  { id: "T-1002", title: "Upgrade dependencies", status: "In Progress", priority: "Low", assignee: "Jamie", createdAt: "2025-10-29" },
  { id: "T-1003", title: "Add billing address field", status: "Closed", priority: "Medium", assignee: "Sam", createdAt: "2025-10-27" },
  { id: "T-1004", title: "Optimize dashboard chart", status: "Open", priority: "Medium", assignee: "Maya", createdAt: "2025-10-26" },
  { id: "T-1005", title: "Fix 500 on /orders", status: "In Progress", priority: "High", assignee: "Riley", createdAt: "2025-10-25" },
];

// ---- Small UI primitives ----
const Badge: React.FC<{ children: React.ReactNode; tone?: "zinc"|"blue"|"green"|"amber"|"red" }>
= ({ children, tone = "zinc" }) => (
  <span className={
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
    (
      tone === "blue" ? "bg-blue-100 text-blue-700" :
      tone === "green" ? "bg-green-100 text-green-700" :
      tone === "amber" ? "bg-amber-100 text-amber-800" :
      tone === "red" ? "bg-red-100 text-red-700" :
      "bg-zinc-100 text-zinc-700"
    )
  }>{children}</span>
);

const Card: React.FC<{ title: string; value: React.ReactNode; helper?: string }>
= ({ title, value, helper }) => (
  <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-zinc-900">
    <div className="text-sm text-zinc-500 dark:text-zinc-400">{title}</div>
    <div className="mt-2 text-2xl font-semibold">{value}</div>
    {helper && <div className="mt-1 text-xs text-zinc-500">{helper}</div>}
  </div>
);

// ---- Helpers ----
function cn(...classes: (string | false | undefined)[]) { return classes.filter(Boolean).join(" "); }

// ---- Main Demo App ----
export default function DemoScaffold() {
  const [items, setItems] = useState<Ticket[]>(seed);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [drawer, setDrawer] = useState<{ open: boolean; editing?: Ticket | null }>({ open: false, editing: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((t) => {
      const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase()) || t.assignee.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All" ? true : t.status === status;
      const matchesPriority = priority === "All" ? true : t.priority === priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [items, query, status, priority]);

  const counts = useMemo(() => ({
    total: items.length,
    open: items.filter(i => i.status === "Open").length,
    inprog: items.filter(i => i.status === "In Progress").length,
    closed: items.filter(i => i.status === "Closed").length,
  }), [items]);

  function openNew() { setDrawer({ open: true, editing: null }); }
  function openEdit(t: Ticket) { setDrawer({ open: true, editing: t }); }
  function remove(id: string) { setItems(prev => prev.filter(p => p.id !== id)); }

  function upsert(data: Omit<Ticket, "id"> & { id?: string }) {
    setItems(prev => {
      if (data.id) {
        return prev.map(p => p.id === data.id ? { ...p, ...data } as Ticket : p);
      }
      const id = `T-${Date.now().toString().slice(-6)}`;
      return [{ id, ...data } as Ticket, ...prev];
    });
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white p-4 transition-all dark:bg-zinc-900",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-black dark:bg-white" />
            <span className="text-lg font-semibold">Demo Admin</span>
          </div>
          <button className="md:hidden rounded-lg border px-2 py-1" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="mt-6 space-y-1 text-sm">
        <a href="/" className="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">Home</a>
        <a className="block rounded-lg px-3 py-2 font-medium bg-zinc-100 dark:bg-zinc-800">Dashboard</a>
        <a href="/v2" className="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">UI v2 (FastAPI)</a>   
          <a className="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">Tickets</a>
          <a className="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">Settings</a>
        </nav>
        <div className="mt-auto hidden md:block pt-10 text-xs text-zinc-500">v1.0 • React + TS + Tailwind</div>
      </aside>

      {/* Main */}
      <div className="flex w-full flex-col md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur dark:bg-zinc-900/80">
            <div className="flex items-center gap-3 p-3">
            <button className="md:hidden rounded-lg border px-3 py-2" onClick={() => setSidebarOpen(true)}>☰</button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="ml-auto flex items-center gap-3">
              <div className="relative hidden lg:flex">
                <input
                  placeholder="Search…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-56 rounded-xl border bg-white px-3 py-2 pl-9 text-sm outline-none ring-0 focus:border-zinc-400 dark:bg-zinc-950"
                />
                <span className="pointer-events-none absolute left-2.5 top-2.5 text-zinc-400">🔎</span>
              </div>
              <button onClick={openNew} className="hidden lg:flex rounded-xl bg-black px-3 py-2 text-sm font-medium text-white shadow hover:shadow-md active:scale-[.99] dark:bg-white dark:text-white">New Ticket</button>
              <div className="h-8 w-8 rounded-xl bg-black dark:bg-white" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="w-full flex-1 p-4 md:p-6 space-y-6 max-w-none">
          {/* KPI Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Total" value={counts.total} />
            <Card title="Open" value={<div className="flex items-center gap-2">{counts.open} <Badge tone="blue">+2</Badge></div>} />
            <Card title="In Progress" value={counts.inprog} />
            <Card title="Closed (7d)" value={<div className="flex items-center gap-2">{counts.closed} <Badge tone="green">+1</Badge></div>} />
          </section>

          <div className="mx-auto lg:hidden flex w-full items-center justify-center gap-3">
  <div className="relative">
    <input
      placeholder="Search…"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-56 rounded-xl border bg-white px-3 py-2 pl-9 text-sm outline-none ring-0 focus:border-zinc-400 dark:bg-zinc-950"
    />
    <span className="pointer-events-none absolute left-2.5 top-2.5 text-zinc-400">🔎</span>
  </div>

  <button
    onClick={openNew}
    className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white shadow hover:shadow-md active:scale-[.99] dark:bg-white dark:text-white"
  >
    New Ticket
  </button>
</div>




          {/* Filters + Table */}
          <section className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-zinc-900">
            <div className="flex flex-wrap items-center gap-3">
              <select value={status} onChange={(e)=>setStatus(e.target.value as any)} className="rounded-xl border px-3 py-2 text-sm">
                {(["All","Open","In Progress","Closed"] as const).map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={priority} onChange={(e)=>setPriority(e.target.value as any)} className="rounded-xl border px-3 py-2 text-sm">
                {(["All","Low","Medium","High"] as const).map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="ml-auto text-sm text-zinc-500">{filtered.length} result(s)</div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b text-zinc-500">
                    <th className="py-2 pr-3">ID</th>
                    <th className="py-2 pr-3">Title</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Priority</th>
                    <th className="py-2 pr-3">Assignee</th>
                    <th className="py-2 pr-3">Created</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b last:border-none hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30">
                      <td className="py-2 pr-3 font-mono text-xs text-zinc-500">{t.id}</td>
                      <td className="py-2 pr-3 font-medium">{t.title}</td>
                      <td className="py-2 pr-3">
                        {t.status === "Open" && <Badge tone="blue">Open</Badge>}
                        {t.status === "In Progress" && <Badge tone="amber">In Progress</Badge>}
                        {t.status === "Closed" && <Badge tone="green">Closed</Badge>}
                      </td>
                      <td className="py-2 pr-3">{t.priority}</td>
                      <td className="py-2 pr-3">{t.assignee}</td>
                      <td className="py-2 pr-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg border px-2 py-1" onClick={() => openEdit(t)}>Edit</button>
                          <button className="rounded-lg border px-2 py-1 text-red-600" onClick={() => remove(t.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-500">No results — try adjusting filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Drawer / Modal */}
      {drawer.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 p-0 md:p-6">
          <div className="h-full w-full max-w-md rounded-none border bg-white p-4 shadow-xl md:rounded-2xl dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{drawer.editing ? "Edit Ticket" : "New Ticket"}</h2>
              <button className="rounded-lg border px-2 py-1" onClick={() => setDrawer({ open: false })}>Close</button>
            </div>
            <TicketForm
              initial={drawer.editing ?? { title: "", status: "Open", priority: "Medium", assignee: "", createdAt: new Date().toISOString() }}
              onSubmit={(data) => { upsert(data); setDrawer({ open: false }); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Ticket Form ----
function TicketForm({ initial, onSubmit }: { initial: Omit<Ticket, "id">; onSubmit: (data: Omit<Ticket, "id"> & { id?: string }) => void }) {
  const [title, setTitle] = useState(initial.title);
  const [status, setStatus] = useState<Status>(initial.status);
  const [priority, setPriority] = useState<Priority>(initial.priority);
  const [assignee, setAssignee] = useState(initial.assignee);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ ...initial, title, status, priority, assignee });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:bg-zinc-950"
          placeholder="Short summary"
          value={title}
          onChange={e=>setTitle(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" value={status} onChange={e=>setStatus(e.target.value as Status)}>
            {(["Open","In Progress","Closed"] as const).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" value={priority} onChange={e=>setPriority(e.target.value as Priority)}>
            {(["Low","Medium","High"] as const).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Assignee</label>
        <input
          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:bg-zinc-950"
          placeholder="Who owns this?"
          value={assignee}
          onChange={e=>setAssignee(e.target.value)}
        />
      </div>
      <div className="pt-2">
        <button type="submit" className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:shadow active:scale-[.99] dark:bg-white dark:text-white">
          Save
        </button>
      </div>
    </form>
  );
}
