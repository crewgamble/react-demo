import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link, NavLink, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DemoLocal from "./pages/DemoLocal";
import DemoApi from "./pages/DemoApi";
import Landing from "./pages/Landing";
import "./index.css";




// function Layout() {
//   return (
//     <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
//       <header className="w-full sticky top-0 z-30 border-b bg-white/80 backdrop-blur dark:bg-zinc-900/80">
//         <div className="mx-auto flex w-full max-w-none items-center gap-4 p-3">
//           <Link to="/" className="text-lg font-semibold">Demo Suite</Link>
//           <nav className="ml-auto flex items-center gap-2 text-sm">
//             <NavLink to="/v1" className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? "bg-zinc-200 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>UI v1 (Local)</NavLink>
//             <NavLink to="/v2" className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? "bg-zinc-200 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>UI v2 (FastAPI)</NavLink>
//           </nav>
//         </div>
//       </header>

//       <div className="min-h-screen w-screen overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
//         <main className="w-screen max-w-none   md:pl-64 min-w-0">
//         <Outlet />
//       </main>
//       </div>
//     </div>
//   );
// }

// ---------- Base layout (no header) ----------
function BaseLayout() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="w-screen max-w-none min-w-0 ">
        <Outlet />
      </main>
    </div>
  );
}

// ---------- V2 layout (adds header) ----------
function V2Layout() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur dark:bg-zinc-900/80">
        <div className="flex w-full items-center gap-4 p-3">
          <Link to="/" className="text-lg font-semibold">Return Home</Link>
          <nav className="ml-auto flex items-center gap-2 text-sm">
            <NavLink to="/v1" className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? "bg-zinc-200 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>UI v1 (Local)</NavLink>
            <NavLink to="/v2" className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? "bg-zinc-200 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>UI v2 (FastAPI)</NavLink>
          </nav>
        </div>
      </header>

      <main className="w-screen max-w-none min-w-0 p-3 sm:p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}


const router = createBrowserRouter([
  { element: <BaseLayout />, children: [
      { index: true, element: <Landing /> },   // 👈 homepage
      { path: "/v1", element: <DemoLocal /> },
    ]
  },
  { element: <V2Layout />, children: [
      { path: "/v2", element: <DemoApi /> },
    ]
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);