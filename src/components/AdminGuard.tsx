import { Navigate } from "react-router-dom";

function isValidToken(token: string | null): boolean {
  if (!token) return false;
  const exp = parseInt(token, 10);
  return !isNaN(exp) && Date.now() < exp;
}

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const token = sessionStorage.getItem("admin_token");
  if (!isValidToken(token)) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default AdminGuard;
