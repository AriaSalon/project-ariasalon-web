import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) { setStatus("denied"); return; }

    fetch("/api/admin-verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setStatus(data.valid ? "ok" : "denied"))
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "checking") return null;
  if (status === "denied") return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default AdminGuard;
