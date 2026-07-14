import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import TechnicienDashboard from "./pages/technicien/TechnicienDashboard";

import Dashboard from "./pages/Dashboard";
import Vehicules from "./pages/Vehicules";
import Interventions from "./pages/Interventions";
import InterventionForm from "./pages/InterventionForm";
import Users from "./pages/Users";
import Pieces from "./pages/Pieces";
import Achats from "./pages/Achats";
import Fournisseurs from "./pages/Fournisseur";
import AIAnalytics from "./pages/AIAnalytics";
import MediaManager from "./pages/MediaManager";
import Devis from "./pages/Devis";
import Factures from "./pages/Factures";
import Techniciens from "./pages/Techniciens";
import VehiculeDetails from "./pages/VehiculeDetails";
import InterventionDetails from "./pages/InterventionDetails";
import TechnicienDetails from "./pages/TechnicienDetails";
import ClientDetails from "./pages/ClientDetails";
import Clients from "./pages/Clients";
import Rapports from "./pages/Rapports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ClientDevisValidation from "./pages/ClientDevisValidation";
import ClientSuiviPublic from "./pages/ClientSuiviPublic";

import Login from "./pages/Login";
import { getCurrentUser } from "./services/auth.service";

const SETTINGS_KEY = "garageflow_settings";

const defaultSettings = {
  language: "fr",
  darkMode: false,
  compactMode: false,
};

function readAppSettings() {
  const savedSettings = localStorage.getItem(SETTINGS_KEY);

  if (!savedSettings) {
    return defaultSettings;
  }

  try {
    return {
      ...defaultSettings,
      ...JSON.parse(savedSettings),
    };
  } catch {
    return defaultSettings;
  }
}

function AppLayout() {
  const { i18n } = useTranslation();
  const location = useLocation();

  const currentUser = getCurrentUser();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem("sidebarOpen") !== "false";
  });

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const applyAppSettings = (nextSettings = readAppSettings()) => {
      document.documentElement.classList.toggle("dark", nextSettings.darkMode);
      document.documentElement.classList.toggle("compact", nextSettings.compactMode);
      document.documentElement.dataset.theme = nextSettings.darkMode ? "dark" : "light";

      if (nextSettings.language && i18n.language !== nextSettings.language) {
        i18n.changeLanguage(nextSettings.language);
      }
    };

    const handleSettingsChange = (event) => {
      applyAppSettings(event.detail);
    };

    applyAppSettings();
    window.addEventListener("garageflow-settings-change", handleSettingsChange);

    return () => {
      window.removeEventListener("garageflow-settings-change", handleSettingsChange);
    };
  }, [i18n]);

  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setSidebarOpen(event.detail.open);
    };

    window.addEventListener("sidebar-toggle", handleSidebarToggle);

    return () => {
      window.removeEventListener("sidebar-toggle", handleSidebarToggle);
    };
  }, []);

  const isPublicClientPage =
    location.pathname.startsWith("/client/devis/") ||
    location.pathname.startsWith("/client/suivi/");

  if (isPublicClientPage) {
    return (
      <Routes>
        <Route path="/client/devis/:token" element={<ClientDevisValidation />} />
        <Route path="/client/suivi/:token" element={<ClientSuiviPublic />} />
      </Routes>
    );
  }

  const isAuthPage = location.pathname === "/login";

  if (isAuthPage) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? (
              currentUser.role === "TECHNICIEN" ? (
                <Navigate to="/technicien/dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    );
  }

  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const sidebarWidth = sidebarOpen ? 260 : 76;

  const desktopMargin =
    i18n.language === "ar"
      ? { marginRight: `${sidebarWidth}px` }
      : { marginLeft: `${sidebarWidth}px` };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900 overflow-x-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={window.innerWidth >= 1024 ? desktopMargin : undefined}
      >
        <Navbar />

        <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pt-20 lg:pt-24 pb-6">
          <Routes>
            {/* ================= ADMIN + GESTIONNAIRE ================= */}

            <Route
              path="/"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Dashboard />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/ai"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <AIAnalytics />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/clients"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Clients />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/clients/:id"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <ClientDetails />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/techniciens"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Techniciens />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/techniciens/:id"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <TechnicienDetails />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/pieces"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Pieces />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/achats"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Achats />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/fournisseurs"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Fournisseurs />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/media"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <MediaManager />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/devis"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Devis />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/factures"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Factures />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/rapports"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Rapports />
                </RoleProtectedRoute>
              }
            />

            {/* ================= ADMIN SEULEMENT ================= */}

            <Route
              path="/users"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                  <Users />
                </RoleProtectedRoute>
              }
            />

            {/* ================= TECHNICIEN ================= */}

            <Route
              path="/technicien/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={["TECHNICIEN"]}>
                  <TechnicienDashboard />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/technicien/performance"
              element={
                <RoleProtectedRoute allowedRoles={["TECHNICIEN"]}>
                  <TechnicienDetails />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/technicien/interventions"
              element={
                <RoleProtectedRoute allowedRoles={["TECHNICIEN"]}>
                  <Interventions />
                </RoleProtectedRoute>
              }
            />

            {/* ================= PARTAGÉ ADMIN + GESTIONNAIRE + TECHNICIEN ================= */}

            <Route
              path="/vehicules"
              element={
                <RoleProtectedRoute
                  allowedRoles={["ADMIN", "GESTIONNAIRE", "TECHNICIEN"]}
                >
                  <Vehicules />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/vehicules/:id"
              element={
                <RoleProtectedRoute
                  allowedRoles={["ADMIN", "GESTIONNAIRE", "TECHNICIEN"]}
                >
                  <VehiculeDetails />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/interventions"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <Interventions />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/interventions/new"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "GESTIONNAIRE"]}>
                  <InterventionForm />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/interventions/details/:id"
              element={
                <RoleProtectedRoute
                  allowedRoles={["ADMIN", "GESTIONNAIRE", "TECHNICIEN"]}
                >
                  <InterventionDetails />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/interventions/:id"
              element={
                <RoleProtectedRoute
                  allowedRoles={["ADMIN", "GESTIONNAIRE", "TECHNICIEN"]}
                >
                  <InterventionForm />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <RoleProtectedRoute
                  allowedRoles={["ADMIN", "GESTIONNAIRE", "TECHNICIEN"]}
                >
                  <Profile />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <RoleProtectedRoute
                  allowedRoles={["ADMIN", "GESTIONNAIRE", "TECHNICIEN"]}
                >
                  <Settings />
                </RoleProtectedRoute>
              }
            />

            {/* ================= FALLBACK ================= */}

            <Route
              path="*"
              element={
                currentUser.role === "TECHNICIEN" ? (
                  <Navigate to="/technicien/dashboard" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
