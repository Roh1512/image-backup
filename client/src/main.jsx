import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { RefreshContextProvider } from "./context/RefreshContext.jsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (import.meta.env.MODE === "production" || import.meta.env.PROD) {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <RefreshContextProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </RefreshContextProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
