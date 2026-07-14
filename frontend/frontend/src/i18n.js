import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      dashboard: "Dashboard",
      vehicles: "Véhicules",
      interventions: "Interventions",
      invoices: "Factures",
      purchases: "Achats",
      suppliers: "Fournisseurs",
      users: "Utilisateurs",
      logout: "Déconnexion"
    }
  },

  ar: {
    translation: {
      dashboard: "لوحة التحكم",
      vehicles: "المركبات",
      interventions: "التدخلات",
      invoices: "الفواتير",
      purchases: "المشتريات",
      suppliers: "الموردون",
      users: "المستخدمون",
      logout: "تسجيل الخروج"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr",
    fallbackLng: "fr",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;