import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

// Cached synchronous view of the current session, kept in sync via onAuthStateChange.
let cachedUser: AuthUser | null = null;
if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => {
    const u = data.session?.user;
    cachedUser = u
      ? {
          id: u.id,
          email: u.email ?? "",
          name:
            (u.user_metadata?.full_name as string | undefined) ??
            (u.user_metadata?.name as string | undefined),
        }
      : null;
  });
  supabase.auth.onAuthStateChange((_e, session) => {
    const u = session?.user;
    cachedUser = u
      ? {
          id: u.id,
          email: u.email ?? "",
          name:
            (u.user_metadata?.full_name as string | undefined) ??
            (u.user_metadata?.name as string | undefined),
        }
      : null;
  });
}

export function getUser(): AuthUser | null {
  return cachedUser;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    name:
      (data.user.user_metadata?.full_name as string | undefined) ??
      (data.user.user_metadata?.name as string | undefined),
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}
