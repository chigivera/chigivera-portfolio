import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create a strict mode wrapper to help catch issues early
createRoot(document.getElementById("root")!).render(
  <App />
);
