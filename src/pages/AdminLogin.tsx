import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input }),
      });
      if (res.ok) {
        const { token } = await res.json();
        sessionStorage.setItem("admin_token", token);
        navigate("/admin");
      } else {
        setError(true);
        setInput("");
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-2">Aria Salon</p>
          <h1 className="font-display text-2xl font-semibold">Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-secondary rounded-xl p-6 border border-border space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Adgangskode</label>
            <input
              type="password"
              autoFocus
              value={input}
              onChange={e => { setInput(e.target.value); setError(false); }}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
            {error && <p className="text-destructive text-xs mt-1.5">Forkert adgangskode</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary text-background py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Logger ind…" : "Log ind"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
