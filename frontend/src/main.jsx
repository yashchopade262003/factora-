import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { SidebarProvider } from "./context/SidebarContext";

import App from "./App";

import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <SidebarProvider>
                <App />
            </SidebarProvider>
        </BrowserRouter>
    </React.StrictMode>
);