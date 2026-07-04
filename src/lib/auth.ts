import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
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
