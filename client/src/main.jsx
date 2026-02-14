import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { IssueProvider } from "./context/IssueContext.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import "leaflet/dist/leaflet.css";
import "./index.css";
import SocketProvider from "./providers/SocketProvider.jsx";
import { Toaster } from "sonner";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SocketProvider>
        <BrowserRouter>
          <IssueProvider>
            <App />
            <Toaster richColors position="top-right" closeButton />
          </IssueProvider>
        </BrowserRouter>
      </SocketProvider>
    </ClerkProvider>
  </StrictMode>,
);
