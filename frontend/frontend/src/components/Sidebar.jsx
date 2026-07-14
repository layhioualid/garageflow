import {
  FaChartPie,
  FaCar,
  FaTools,
  FaUsers,
  FaCubes,
  FaShoppingCart,
  FaIndustry,
  FaRobot,
  FaFolder,
  FaFileInvoice,
  FaFileAlt,
  FaUserCog,
  FaIdCard,
  FaChartLine,
  FaCog,
  FaUser,
  FaTachometerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getCurrentUser } from "../services/auth.service";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getCurrentUser();
  const role = currentUser?.role;
  const isTechnicien = role === "TECHNICIEN";

  const [open, setOpen] = useState(() => {
    return localStorage.getItem("sidebarOpen") !== "false";
  });

  useEffect(() => {
    const width = open ? "260px" : "76px";

    document.documentElement.style.setProperty("--sidebar-width", width);
    localStorage.setItem("sidebarOpen", open ? "true" : "false");

    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", {
        detail: { open, width },
      })
    );
  }, [open]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const getInitials = () => {
    const prenom = currentUser?.prenom?.charAt(0) || "";
    const nom = currentUser?.nom?.charAt(0) || "";
    return `${prenom}${nom}`.toUpperCase() || "GF";
  };

  const NavItem = ({ path, icon: Icon, label }) => {
    const active = isActive(path);

    return (
      <button
        onClick={() => navigate(path)}
        title={!open ? label : ""}
        className={`relative w-full h-11 rounded-2xl flex items-center transition-all duration-200 group ${
          open ? "justify-start gap-3 px-4" : "justify-center px-0"
        } ${
          active
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-white" />
        )}

        <Icon
          className={`text-[16px] shrink-0 transition ${
            active ? "text-white" : "text-slate-400 group-hover:text-blue-600"
          }`}
        />

        {open && (
          <span className="text-sm font-bold whitespace-nowrap overflow-hidden">
            {label}
          </span>
        )}
      </button>
    );
  };

  const SectionTitle = ({ children }) => {
    if (!open) return <div className="h-3" />;

    return (
      <div className="px-4 pt-5 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {children}
      </div>
    );
  };

  return (
    <motion.aside
      animate={{ width: open ? 260 : 76 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-screen z-50 bg-white border-r border-slate-200 shadow-sm flex flex-col overflow-hidden"
    >
      {/* HEADER */}
      <div className="h-[76px] border-b border-slate-200 flex items-center px-3 shrink-0 bg-white">
        {open ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-sm">
                  {getInitials()}
                </div>

                <span className="absolute -right-0.5 top-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
              </div>

              <div className="min-w-0">
                <h1 className="text-lg font-black text-slate-950 leading-none truncate">
                  Garage<span className="text-blue-600">Flow+</span>
                </h1>

                <p className="text-[11px] text-slate-400 font-semibold mt-1 truncate">
                  {isTechnicien ? "Espace technicien" : "Management system"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white flex items-center justify-center transition shrink-0"
              title="Fermer"
            >
              <FaChevronLeft />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="w-full h-11 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white flex items-center justify-center transition"
            title="Ouvrir"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* USER SMALL */}
      {open && (
        <div className="px-4 py-4 border-b border-slate-100 bg-slate-50/60">
          <p className="text-sm font-black text-slate-900 truncate">
            {currentUser?.prenom || currentUser?.nom || "Utilisateur"}
          </p>

          <p className="text-xs text-slate-400 font-semibold mt-1 truncate">
            {role || "USER"}
          </p>
        </div>
      )}

      {/* NAV */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-1 bg-white">
        {isTechnicien ? (
          <>
            <SectionTitle>Technicien</SectionTitle>

            <NavItem
              path="/technicien/dashboard"
              icon={FaChartPie}
              label="Dashboard"
            />

            <NavItem
              path="/technicien/performance"
              icon={FaTachometerAlt}
              label="Performance"
            />

            <NavItem
              path="/technicien/interventions"
              icon={FaTools}
              label="Mes interventions"
            />

            <NavItem path="/vehicules" icon={FaCar} label="Véhicules liés" />

            <SectionTitle>Compte</SectionTitle>

            <NavItem path="/profile" icon={FaUser} label="Mon profil" />

            
          </>
        ) : (
          <>
            <NavItem path="/" icon={FaChartPie} label="Dashboard" />

            <NavItem path="/ai" icon={FaRobot} label="AI Analytics" />

            <SectionTitle>Flotte</SectionTitle>

            <NavItem path="/vehicules" icon={FaCar} label="Véhicules" />

            <NavItem
              path="/interventions"
              icon={FaTools}
              label="Interventions"
            />

            <NavItem
              path="/techniciens"
              icon={FaUserCog}
              label="Techniciens"
            />

            <SectionTitle>Clients</SectionTitle>

            <NavItem path="/clients" icon={FaIdCard} label="Clients" />

            <SectionTitle>Finance</SectionTitle>

            <NavItem path="/devis" icon={FaFileAlt} label="Devis" />

            <NavItem
              path="/factures"
              icon={FaFileInvoice}
              label="Factures"
            />

            <SectionTitle>Stock</SectionTitle>

            <NavItem path="/pieces" icon={FaCubes} label="Pièces" />

            <NavItem path="/achats" icon={FaShoppingCart} label="Achats" />

            <NavItem
              path="/fournisseurs"
              icon={FaIndustry}
              label="Fournisseurs"
            />

            <SectionTitle>Admin</SectionTitle>

            {role === "ADMIN" && (
              <NavItem path="/users" icon={FaUsers} label="Utilisateurs" />
            )}

            <NavItem path="/rapports" icon={FaChartLine} label="Rapports" />

            <NavItem path="/media" icon={FaFolder} label="Média" />

            <SectionTitle>Compte</SectionTitle>

            <NavItem path="/profile" icon={FaUser} label="Mon profil" />

          
          </>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200 bg-white p-3 shrink-0">
        {open ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-3 py-3">
            <p className="text-xs font-black text-slate-800">
              {isTechnicien ? "Technicien connecté" : "GarageFlow+"}
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              {role || "Utilisateur"} • 2026
            </p>
          </div>
        ) : (
          <button
            onClick={() => navigate("/settings")}
            className="w-full h-10 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition"
            title="Paramètres"
          >
            <FaCog />
          </button>
        )}
      </div>
    </motion.aside>
  );
}