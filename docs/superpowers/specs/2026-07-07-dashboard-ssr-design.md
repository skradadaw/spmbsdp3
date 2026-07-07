# Admin Dashboard Data Synchronization (Server-Side Rendering)

## Overview
The goal is to ensure the admin dashboard always displays the freshest data directly from the Supabase database each time the page is accessed, preventing stale data and avoiding complex client-side caching.

## Architecture & Components

### 1. `src/app/admin/dashboard/page.tsx`
- **Current State:** A Client Component (`"use client"`) utilizing `useState` and `useEffect` to fetch data on component mount.
- **New Design:** Convert to a React Server Component (RSC).
  - Remove `"use client"`, `useState`, and `useEffect`.
  - Add `export const dynamic = "force-dynamic";` to instruct Next.js not to cache this page statically.
  - The component will be an `async function AdminDashboardPage()` that directly `await`s the `getDashboardMetrics()` action.
  - The fetched `metrics` and `error` states will be rendered directly by the server.

### 2. `src/app/admin/dashboard/actions.ts`
- **Current State:** Contains `getDashboardMetrics` server action.
- **New Design:** Remains mostly untouched as it already executes on the server (`"use server"`). It will be directly invoked during the SSR phase by `page.tsx`.

## Data Flow
1. User navigates to `/admin/dashboard`.
2. Next.js server handles the request (bypassing static cache due to `force-dynamic`).
3. Server executes `AdminDashboardPage`, which calls `getDashboardMetrics()`.
4. `getDashboardMetrics()` queries Supabase for the latest registrant (`pendaftar`) and document (`dokumen`) counts.
5. Server renders the HTML with the exact fresh numbers and sends it to the client.
6. The user instantly sees the dashboard fully rendered with up-to-date data (No client-side loading spinners needed).

## Error Handling
If `getDashboardMetrics()` returns an error, it will be gracefully caught and displayed inside the existing error banner UI natively on the server.
