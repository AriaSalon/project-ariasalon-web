import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold font-display">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Siden blev ikke fundet</p>
        <Link to="/" className="text-primary underline hover:opacity-80 transition-opacity">
          Gå til forsiden
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
