import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/index.css";

const container = document.getElementById("root");

if (!container) throw new Error("Root container missing!");

const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
