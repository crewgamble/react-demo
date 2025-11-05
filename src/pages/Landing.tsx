import React from "react";
import { Link, NavLink } from "react-router-dom";

function cn(...a: (string | false | undefined)[]) { return a.filter(Boolean).join(" "); }

export default function Landing() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded-xl bg-black dark:bg-white" />
            <span className="text-lg font-semibold">UI Demo</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/v1">UI v1</NavItem>
            <NavItem to="/v2">UI v2</NavItem>
            <Link
              to="/v2"
              className="ml-2 rounded-xl bg-black px-3 py-2 text-sm font-medium shadow hover:shadow-md active:scale-[.99] dark:bg-white dark:text-black bg-primary text-white"
            >
              Get Started
            </Link>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="ml-auto rounded-lg border px-3 py-2 md:hidden"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              <NavItem to="/" onClick={() => setOpen(false)}>Home</NavItem>
              <NavItem to="/v1" onClick={() => setOpen(false)}>UI v1</NavItem>
              <NavItem to="/v2" onClick={() => setOpen(false)}>UI v2</NavItem>
              <Link
                to="/v2"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-xl bg-black px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_-20%,rgba(99,102,241,.15),transparent)] dark:bg-[radial-gradient(800px_400px_at_50%_-20%,rgba(99,102,241,.25),transparent)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Ship beautiful AI products, fast.
            </h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-300">
              A modern React + TypeScript + Tailwind stack with live API demos.
              Explore the local UI or the FastAPI-backed version.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/v2"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow hover:shadow-md active:scale-[.99] dark:bg-white dark:text-white bg-primary"
              >
                Try the API Demo
              </Link>
              <Link
                to="/v1"
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              >
                View UI v1
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-zinc-500">
              <span>React 19</span>•<span>TypeScript</span>•<span>Tailwind v4</span>•<span>FastAPI</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-zinc-900">
            <div className="rounded-xl border bg-zinc-50 p-4 font-mono text-xs dark:bg-zinc-950">
              <p>// Simple fetch to your FastAPI backend</p>
              <pre className="whitespace-pre-wrap">
{`POST https://react-demo-p3sd.onrender.com/tickets
                  {
                    "title": "Title Class",
                    "status": "Ticket Status",
                    "priority": "Priority",
                    "assignee": "Name"
                  }
                `},

              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature title="Type-Safe by Default" desc="End-to-end TS with strict types and reusable hooks." />
          <Feature title="Modern UI Kit" desc="Tailwind utility-first styling with responsive patterns." />
          <Feature title="API Ready" desc="FastAPI sample with CRUD and React Query integration." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-2xl border bg-white p-6 text-center shadow-sm dark:bg-zinc-900">
          <h2 className="text-2xl font-semibold">Ready to see it in action?</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Jump straight into the FastAPI demo or browse the local UI.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link to="/v2" className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black bg-primary text-white">Open API Demo</Link>
            <Link to="/v1" className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800/50">Explore UI v1</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} UI Demo — <Link to="/v2" className="underline underline-offset-2">/v2 Demo</Link>
      </footer>
    </div>
  );
}

function NavItem({ to, children, onClick }:{ to:string; children:React.ReactNode; onClick?:()=>void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "rounded-lg px-3 py-2 text-sm",
          isActive ? "bg-zinc-200 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )
      }
    >
      {children}
    </NavLink>
  );
}

function Feature({ title, desc }:{ title:string; desc:string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-zinc-900">
      <div className="mb-2 text-lg font-semibold">{title}</div>
      <div className="text-sm text-zinc-600 dark:text-zinc-300">{desc}</div>
    </div>
  );
}
