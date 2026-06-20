// Auth is handled client-side in dashboard/admin layouts.
// Middleware removed to prevent login redirect loops.
export function middleware() {}

export const config = {
  matcher: [],
};