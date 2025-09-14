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
  // example: allow read-only public access
  // { path: "/workstations", method: "GET" }
];