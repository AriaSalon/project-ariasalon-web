import { useState } from "react";

const BETA_PASSWORD = "aria2026";

const BetaGate = ({ children }: { children: React.ReactNode }) => {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("beta_unlocked") === "true"
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === BETA_PASSWORD) {
      sessionStorage.setItem("beta_unlocked", "true");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
          Aria Salon
        </p>
        <h1 className="font-display text-3xl text-white mb-2">Beta adgang</h1>
        <p className="text-white/50 text-sm mb-8">Siden er ikke offentlig endnu.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Adgangskode"
            className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:border-primary"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs">Forkert adgangskode</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Gå til siden
          </button>
        </form>
      </div>
    </div>
  );
};

export default BetaGate;
