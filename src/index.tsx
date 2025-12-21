import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");

if (!container) throw new Error("Root container missing!");

const root = createRoot(container);

root.render(<App />);
