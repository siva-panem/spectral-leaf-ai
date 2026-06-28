// Mock client-side auth — no backend yet.
const KEY = "mg_user";

export interface MockUser {
  name: string;
  email: string;
  avatar?: string;
}

export function getUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function signIn(user: MockUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function signOut() {
  localStorage.removeItem(KEY);
}
