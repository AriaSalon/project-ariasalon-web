import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cookie_consent";

function updateGtagConsent(granted: boolean) {
  if (typeof window.gtag !== "function") return;
  const state = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    analytics_storage: state,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else if (stored === "accepted") {
      updateGtagConsent(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    updateGtagConsent(true);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    updateGtagConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-[#1a1a1a] border border-border rounded-xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          Vi bruger cookies til at analysere trafikken på siden og forbedre din oplevelse.{" "}
          <Link to="/privatlivspolitik" className="text-primary underline underline-offset-2">
            Læs mere
          </Link>
        </p>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
          >
            Kun nødvendige
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md bg-primary text-background hover:opacity-90 transition-opacity touch-manipulation"
          >
            Accepter alle
          </button>
        </div>
      </div>
    </div>
  );
}
