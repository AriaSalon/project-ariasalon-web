import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import BetaGate from "./components/BetaGate.tsx";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
createRoot(root).render(
  <BetaGate>
    <App />
  </BetaGate>
);
