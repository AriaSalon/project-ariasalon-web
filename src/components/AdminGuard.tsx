import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  if (sessionStorage.getItem("admin_access") !== "true") {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default AdminGuard;
