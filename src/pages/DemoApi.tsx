import React, { useMemo, useState } from "react";
import { useTickets, useCreateTicket, useUpdateTicket, useDeleteTicket } from "../services/tickets";
import { createBrowserRouter, RouterProvider, Link, NavLink, Outlet } from "react-router-dom";

function cn(...classes: (string | false | undefined)[]) { return classes.filter(Boolean).join(" "); }


export default function DemoApi() {
    const { data, isLoading, isError } = useTickets();
    const createMut = useCreateTicket();
    const updateMut = useUpdateTicket();
    const deleteMut = useDeleteTicket();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [query, setQuery] = useState("");
    const items = data ?? [];
    const filtered = useMemo(() => items.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.assignee.toLowerCase().includes(query.toLowerCase())), [items, query]);


    return (
        


        <div className="w-full"> {/* page is full width */}
        

            <h1 className="mb-4 text-xl font-semibold text-center">UI v2 — FastAPI-backed</h1>

            {/* toolbar fills on mobile, shrinks on larger screens */}
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                <input
                    className="w-full sm:w-64 rounded-xl border px-3 py-2 text-sm"
                    placeholder="Search…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    onClick={() =>
                        createMut.mutate({
                            title: "New from UI",
                            status: "Open",
                            priority: "Medium",
                            assignee: "You",
                        })
                    }
                    className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-white"
                >
                    Quick Add
                </button>
            </div>

            {/* ONLY this section is width-capped */}
            <div className="mx-auto w-full max-w-6xl">   {/* 👈 cap & center */}
                <div className="overflow-x-auto rounded-2xl border bg-white p-3 shadow-sm dark:bg-zinc-900">
                    {isLoading && <div className="p-6 text-sm text-zinc-500">Loading…</div>}
                    {isError && <div className="p-6 text-sm text-red-600">Failed to load.</div>}
                    {!isLoading && !isError && (
                        <table className="w-full min-w-[640px] table-fixed border-collapse text-left text-sm break-words">
                            <thead>
                                <tr className="border-b text-zinc-500">
                                    <th className="py-2 pr-3">ID</th>
                                    <th className="py-2 pr-3">Title</th>
                                    <th className="py-2 pr-3">Status</th>
                                    <th className="py-2 pr-3">Priority</th>
                                    <th className="py-2 pr-3">Assignee</th>
                                    <th className="py-2" />
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((t) => (
                                    <tr key={t.id} className="border-b last:border-none">
                                        <td className="py-2 pr-3 font-mono text-xs text-zinc-500">{t.id}</td>
                                        <td className="py-2 pr-3 truncate max-w-[20ch] sm:max-w-none">{t.title}</td>
                                        <td className="py-2 pr-3">{t.status}</td>
                                        <td className="py-2 pr-3">{t.priority}</td>
                                        <td className="py-2 pr-3">{t.assignee}</td>
                                        <td className="py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="rounded-lg border px-2 py-1" onClick={() => updateMut.mutate({ id: t.id, title: t.title + " (edited)" })}>Edit</button>
                                                <button className="rounded-lg border px-2 py-1 text-red-600" onClick={() => deleteMut.mutate(t.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}