import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Calendar, Clock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export const Route = createFileRoute("/app/admin")({
  ssr: false,
  component: AdminPage,
});

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
};

type Row = Profile & { isAdmin: boolean };

function AdminPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) {
        navigate({ to: "/login" });
        return;
      }
      const admin = await isAdmin(u.id);
      if (!admin) {
        setDenied(true);
        setLoading(false);
        return;
      }
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, email, full_name, created_at, last_sign_in_at")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const adminIds = new Set(
        (roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id),
      );
      setRows(
        (profiles ?? []).map((p) => ({ ...(p as Profile), isAdmin: adminIds.has(p.id) })),
      );
      setLoading(false);
    })();
  }, [navigate]);

  if (denied) {
    return (
      <div className="p-8">
        <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center">
          <Shield className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 font-display text-xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This page is only visible to administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/15 p-2.5">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Admin · Registered users
            </h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${rows.length} account${rows.length === 1 ? "" : "s"} on MangoGuard AI`}
            </p>
          </div>
        </div>

        <div className="glass mt-6 overflow-hidden rounded-2xl">
          <div className="grid grid-cols-12 gap-4 border-b border-border/60 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Signed up</div>
            <div className="col-span-3">Last active</div>
            <div className="col-span-2 text-right">Role</div>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading users…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No users yet.</div>
          ) : (
            rows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-12 items-center gap-4 border-b border-border/40 px-5 py-4 text-sm last:border-b-0 hover:bg-white/[0.02]"
              >
                <div className="col-span-4 min-w-0">
                  <div className="flex items-center gap-2 font-medium">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{r.email}</span>
                  </div>
                  {r.full_name && (
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {r.full_name}
                    </div>
                  )}
                </div>
                <div className="col-span-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="col-span-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {r.last_sign_in_at
                    ? new Date(r.last_sign_in_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Never"}
                </div>
                <div className="col-span-2 flex justify-end">
                  {r.isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      User
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          For security, passwords are never stored in plain text and cannot be viewed — even by admins.
        </p>
      </motion.div>
    </div>
  );
}
