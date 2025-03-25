"use client"

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from 'react-error-boundary';
import { logError } from "./utils/errorBoundary/errorBoundaryUtils";
// style
import "./assets/style/index.css";
import AppErrorFallback from "./components/errorBoundary/AppErrorFallback";

const container = document.getElementById("root");



if (container) {
   const root = createRoot(container);

   root.render(
      <React.StrictMode>
         <ErrorBoundary FallbackComponent={AppErrorFallback} >
            <HelmetProvider>
               <BrowserRouter>
                  <Provider store={store}>
                     <App />
                  </Provider>
               </BrowserRouter>
            </HelmetProvider>
         </ErrorBoundary>
      </React.StrictMode>,
   );
} else {
   throw new Error(
      "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
   );
}
