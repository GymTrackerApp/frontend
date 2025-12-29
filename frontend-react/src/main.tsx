import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import ErrorPage from "./pages/ErrorPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import RegisterLogin from "./pages/RegisterLogin.tsx";
import PlanManager from "./pages/PlanManager.tsx";
import Workout from "./pages/Workout.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/register-login" element={<RegisterLogin />} />
          <Route path="/plan-manager" element={<PlanManager />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
