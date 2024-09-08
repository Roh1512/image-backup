import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ThemeProvider } from "./context/themeContext/ThemeContext";
import { RefreshContextProvider } from "./context/RefreshContent.jsx";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";

disableReactDevTools();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RefreshContextProvider>
            <App />
          </RefreshContextProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
