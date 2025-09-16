"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const r = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) r.replace("/admin/login");
    else setOk(true);
  }, [r]);

  if (!ok) return null;
  return <>{children}</>;
}
