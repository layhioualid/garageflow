import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCog,
  FaGlobe,
  FaBell,
  FaMoon,
  FaShieldAlt,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserCog,
  FaDatabase,
  FaPalette,
  FaUndo,
} from "react-icons/fa";

const STORAGE_KEY = "garageflow_settings";

const defaultSettings = {
  language: "fr",
  notifications: true,
  emailAlerts: true,
  darkMode: false,
  compactMode: false,
  autoRefresh: true,
};

function applySettings(nextSettings) {
  document.documentElement.classList.toggle("dark", nextSettings.darkMode);
  document.documentElement.classList.toggle("compact", nextSettings.compactMode);
  document.documentElement.dataset.theme = nextSettings.darkMode ? "dark" : "light";
  document.documentElement.dir = nextSettings.language === "ar" ? "rtl" : "ltr";
}

export default function Settings() {
  const { i18n } = useTranslation();
  const [message, setMessage] = useState("");

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);

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
  });

  useEffect(() => {
    applySettings(settings);
    i18n.changeLanguage(settings.language);
  }, [settings, i18n]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(
      new CustomEvent("garageflow-settings-change", {
        detail: settings,
      })
    );
    showMessage("Parametres enregistres avec succes.");
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    window.dispatchEvent(
      new CustomEvent("garageflow-settings-change", {
        detail: defaultSettings,
      })
    );
    showMessage("Parametres reinitialises.");
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-6 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-indigo-100 rounded-full blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <FaCog className="text-3xl" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
                <FaShieldAlt />
                Configuration systeme
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Parametres
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Gerez les preferences d'affichage, les notifications, la langue
                et les options generales de votre espace GarageFlow+.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetSettings}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition shadow-sm"
            >
              <FaUndo />
              Reinitialiser
            </button>

            <button
              onClick={saveSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition shadow-sm"
            >
              <FaSave />
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="px-5 py-4 rounded-2xl border bg-green-50 border-green-200 text-green-700 flex items-center gap-3 shadow-sm">
          <FaCheckCircle />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[30px] shadow-sm overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 text-white">
              <div className="w-16 h-16 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl">
                <FaUserCog />
              </div>

              <h2 className="text-2xl font-black mt-4">
                Preferences utilisateur
              </h2>

              <p className="text-blue-100 text-sm mt-2 leading-relaxed">
                Ces parametres personnalisent votre experience dans le tableau
                de bord.
              </p>
            </div>

            <div className="p-5 space-y-3">
              <InfoLine icon={<FaGlobe />} label="Langue" value={settings.language.toUpperCase()} />
              <InfoLine
                icon={<FaBell />}
                label="Notifications"
                value={settings.notifications ? "Activees" : "Desactivees"}
              />
              <InfoLine
                icon={<FaPalette />}
                label="Mode affichage"
                value={settings.compactMode ? "Compact" : "Standard"}
              />
              <InfoLine icon={<FaMoon />} label="Theme" value={settings.darkMode ? "Sombre" : "Clair"} />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-[30px] p-5 text-amber-700">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="mt-1 shrink-0" />

              <div>
                <h3 className="font-black">Note</h3>
                <p className="text-sm mt-1 leading-relaxed">
                  Les preferences sont sauvegardees dans ce navigateur. Le theme,
                  la langue et la densite s'appliquent tout de suite.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SettingsCard
            icon={<FaGlobe />}
            title="Preferences generales"
            subtitle="Langue, affichage et comportement general."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500 block mb-2 font-semibold">
                  Langue de l'interface
                </label>

                <select
                  value={settings.language}
                  onChange={(e) => updateSetting("language", e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                >
                  <option value="fr">Francais</option>
                  <option value="en">English</option>
                  <option value="ar">Arabe</option>
                </select>
              </div>

              <ToggleOption
                icon={<FaMoon />}
                title="Mode sombre"
                description="Activer une interface sombre."
                checked={settings.darkMode}
                onChange={(value) => updateSetting("darkMode", value)}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            icon={<FaBell />}
            title="Notifications"
            subtitle="Gerez les alertes systeme et les notifications importantes."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleOption
                icon={<FaBell />}
                title="Notifications systeme"
                description="Alertes stock, factures, interventions."
                checked={settings.notifications}
                onChange={(value) => updateSetting("notifications", value)}
              />

              <ToggleOption
                icon={<FaBell />}
                title="Alertes email"
                description="Recevoir les alertes importantes par email."
                checked={settings.emailAlerts}
                onChange={(value) => updateSetting("emailAlerts", value)}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            icon={<FaPalette />}
            title="Affichage"
            subtitle="Personnalisez la densite visuelle de l'application."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleOption
                icon={<FaPalette />}
                title="Mode compact"
                description="Reduire les espaces dans les tableaux."
                checked={settings.compactMode}
                onChange={(value) => updateSetting("compactMode", value)}
              />

              <ToggleOption
                icon={<FaDatabase />}
                title="Actualisation automatique"
                description="Actualiser automatiquement les donnees."
                checked={settings.autoRefresh}
                onChange={(value) => updateSetting("autoRefresh", value)}
              />
            </div>
          </SettingsCard>

          <div className="bg-white border border-slate-200 rounded-[30px] p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-950">
                Enregistrer les modifications
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Sauvegardez vos preferences pour les prochaines sessions.
              </p>
            </div>

            <button
              onClick={saveSettings}
              className="bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition"
            >
              <FaSave />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[30px] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
          <span className="text-blue-600">{icon}</span>
          {title}
        </h2>

        <p className="text-slate-500 mt-1">{subtitle}</p>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

function ToggleOption({ icon, title, description, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full text-left rounded-3xl border p-5 transition flex items-start justify-between gap-4 ${
        checked
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-slate-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${
            checked
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          {icon}
        </div>

        <div>
          <h3 className="font-black text-slate-950">{title}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <span
        className={`relative w-12 h-7 rounded-full transition shrink-0 ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function InfoLine({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-bold">{label}</p>
        <p className="text-sm font-black text-slate-900 mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}
