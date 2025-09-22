export interface PublicRoute {
  path: string;
  method: string; // "GET" | "POST" | "PUT" | "DELETE"
}

/**
 * Central place to configure which routes are public.
 * Everything else requires authentication.
 */
export const PUBLIC_ROUTES: PublicRoute[] = [
  { path: "/auth/login", method: "POST" },
  { path: "/auth/register", method: "POST" },
  { path: "/users/activate", method: "POST" },
  { path: "/users/request-reset", method: "POST" },
  { path: "/users/reset-password", method: "POST" },
];