import { useEffect, useMemo, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaSyncAlt,
  FaIdBadge,
  FaUserCog,
  FaKey,
  FaTimes,
  FaUndo,
  FaCrown,
} from "react-icons/fa";

import { getCurrentUser, saveAuth } from "../services/auth.service";
import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../services/profile.service";

export default function Profile() {
  const currentUser = getCurrentUser();

  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [initialForm, setInitialForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "",
  });

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmationMotDePasse: "",
  });

  const fullName = useMemo(() => {
    return `${form.nom || ""} ${form.prenom || ""}`.trim() || "Utilisateur";
  }, [form.nom, form.prenom]);

  const initials = useMemo(() => {
    const n = form.nom?.[0] || "";
    const p = form.prenom?.[0] || "";
    return `${n}${p}`.toUpperCase() || "U";
  }, [form.nom, form.prenom]);

  const profileChanged = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  const passwordReady = useMemo(() => {
    return (
      passwordForm.ancienMotDePasse &&
      passwordForm.nouveauMotDePasse &&
      passwordForm.confirmationMotDePasse
    );
  }, [passwordForm]);

  const roleStyle = (role) => {
    if (role === "ADMIN") return "bg-red-50 text-red-700 border-red-200";
    if (role === "GESTIONNAIRE")
      return "bg-purple-50 text-purple-700 border-purple-200";
    if (role === "TECHNICIEN")
      return "bg-blue-50 text-blue-700 border-blue-200";

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4500);
  };

  const loadProfile = async () => {
    try {
      if (!currentUser?.id) {
        showMessage(
          "Utilisateur connecté introuvable. Veuillez vous reconnecter.",
          "error"
        );
        return;
      }

      setLoading(true);

      const res = await getProfile(currentUser.id);
      const user = res.data;

      const cleanUser = {
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        telephone: user.telephone || "",
        role: user.role || "",
      };

      setForm(cleanUser);
      setInitialForm(cleanUser);
    } catch (error) {
      console.error("Erreur chargement profil :", error);

      if (error.response?.data?.message) {
        showMessage(error.response.data.message, "error");
      } else if (error.message === "Network Error") {
        showMessage(
          "Impossible de contacter le backend. Vérifiez que Spring Boot est lancé.",
          "error"
        );
      } else {
        showMessage("Erreur lors du chargement du profil.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadProfile();
    }
  }, []);

  const resetProfile = () => {
    setForm(initialForm);
    showMessage("Modifications annulées.", "success");
  };

  const saveProfile = async () => {
    if (!currentUser?.id) {
      showMessage("Session invalide. Veuillez vous reconnecter.", "error");
      return;
    }

    if (!form.nom || !form.prenom || !form.email) {
      showMessage("Veuillez remplir le nom, le prénom et l'email.", "error");
      return;
    }

    try {
      setSavingProfile(true);

      const res = await updateProfile(currentUser.id, {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
      });

      const updatedUser = res.data;

      const cleanUser = {
        nom: updatedUser.nom || "",
        prenom: updatedUser.prenom || "",
        email: updatedUser.email || "",
        telephone: updatedUser.telephone || "",
        role: updatedUser.role || "",
      };

      setForm(cleanUser);
      setInitialForm(cleanUser);

      saveAuth({
        ...currentUser,
        ...updatedUser,
      });

      showMessage("Profil modifié avec succès.", "success");
    } catch (error) {
      console.error("Erreur modification profil :", error);

      if (error.response?.data?.message) {
        showMessage(error.response.data.message, "error");
      } else if (error.message === "Network Error") {
        showMessage(
          "Impossible de contacter le backend. Vérifiez le serveur ou CORS.",
          "error"
        );
      } else {
        showMessage("Erreur lors de la modification du profil.", "error");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (!currentUser?.id) {
      showMessage("Session invalide. Veuillez vous reconnecter.", "error");
      return;
    }

    if (!passwordReady) {
      showMessage("Veuillez remplir tous les champs du mot de passe.", "error");
      return;
    }

    if (passwordForm.nouveauMotDePasse.length < 6) {
      showMessage(
        "Le nouveau mot de passe doit contenir au moins 6 caractères.",
        "error"
      );
      return;
    }

    if (passwordForm.nouveauMotDePasse !== passwordForm.confirmationMotDePasse) {
      showMessage("La confirmation du mot de passe ne correspond pas.", "error");
      return;
    }

    try {
      setSavingPassword(true);

      await updatePassword(currentUser.id, {
        ancienMotDePasse: passwordForm.ancienMotDePasse,
        nouveauMotDePasse: passwordForm.nouveauMotDePasse,
      });

      setPasswordForm({
        ancienMotDePasse: "",
        nouveauMotDePasse: "",
        confirmationMotDePasse: "",
      });

      showMessage("Mot de passe modifié avec succès.", "success");
    } catch (error) {
      console.error("Erreur modification mot de passe :", error);

      if (error.response?.data?.message) {
        showMessage(error.response.data.message, "error");
      } else if (error.message === "Network Error") {
        showMessage(
          "Impossible de contacter le backend. Vérifiez le serveur ou CORS.",
          "error"
        );
      } else {
        showMessage("Erreur lors de la modification du mot de passe.", "error");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-6 bg-[#f6f8fb] min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-6 flex items-center gap-3">
          <FaExclamationTriangle />
          <span className="font-semibold">
            Aucun utilisateur connecté. Veuillez vous reconnecter.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f6f8fb] text-slate-900 space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700" />
        <div className="absolute -top-24 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

        <div className="relative p-7 md:p-8 text-white">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-[28px] bg-white/15 border border-white/20 flex items-center justify-center text-3xl font-black shadow-xl">
                {initials}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-bold mb-3">
                  <FaShieldAlt />
                  Espace personnel sécurisé
                </div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                  {fullName}
                </h1>

                <p className="text-blue-100 mt-2 max-w-2xl">
                  Gérez vos informations personnelles, vos coordonnées et la
                  sécurité de votre compte GarageFlow+.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black uppercase bg-white/10 border-white/20 text-white`}
                  >
                    <FaCrown />
                    {form.role || "Utilisateur"}
                  </span>

                  {profileChanged && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-100 text-xs font-bold">
                      Modifications non enregistrées
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={loadProfile}
              disabled={loading}
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold transition backdrop-blur disabled:opacity-50"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`px-5 py-4 rounded-2xl border flex items-center justify-between gap-4 shadow-sm ${
            messageType === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3 font-semibold">
            {messageType === "success" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationTriangle />
            )}

            <span>{message}</span>
          </div>

          <button
            onClick={() => setMessage("")}
            className="text-slate-400 hover:text-slate-700 transition"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[32px] p-12 text-center shadow-sm">
          <FaSyncAlt className="animate-spin text-blue-600 text-3xl mx-auto" />
          <p className="text-slate-500 font-semibold mt-4">
            Chargement du profil...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[390px_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-blue-50 to-white">
                <div className="w-24 h-24 mx-auto rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-600/20">
                  {initials}
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-2xl font-black text-slate-950">
                    {fullName}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1 break-all">
                    {form.email || "-"}
                  </p>

                  <span
                    className={`inline-flex mt-4 px-3 py-1.5 rounded-full border text-xs font-black uppercase ${roleStyle(
                      form.role
                    )}`}
                  >
                    {form.role || "ROLE"}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <InfoLine
                  icon={<FaEnvelope />}
                  label="Email professionnel"
                  value={form.email || "-"}
                />

                <InfoLine
                  icon={<FaPhone />}
                  label="Téléphone"
                  value={form.telephone || "Non renseigné"}
                />

                <InfoLine
                  icon={<FaIdBadge />}
                  label="Identifiant utilisateur"
                  value={`#${currentUser.id}`}
                />

                <InfoLine
                  icon={<FaUserCog />}
                  label="Niveau d’accès"
                  value={form.role || "-"}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[32px] p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <FaShieldAlt />
                </div>

                <div>
                  <h3 className="font-black text-slate-950">
                    Sécurité du compte
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Votre mot de passe est stocké de manière chiffrée côté
                    backend avec BCrypt. Modifiez-le régulièrement pour protéger
                    votre compte.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* PROFILE FORM */}
            <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Informations personnelles
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Modifiez les informations affichées dans votre compte.
                  </p>
                </div>

                {profileChanged && (
                  <button
                    onClick={resetProfile}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition"
                  >
                    <FaUndo />
                    Annuler
                  </button>
                )}
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Nom"
                    icon={<FaUser />}
                    value={form.nom}
                    onChange={(value) => setForm({ ...form, nom: value })}
                  />

                  <InputField
                    label="Prénom"
                    icon={<FaUser />}
                    value={form.prenom}
                    onChange={(value) => setForm({ ...form, prenom: value })}
                  />
                </div>

                <InputField
                  label="Adresse email"
                  icon={<FaEnvelope />}
                  type="email"
                  value={form.email}
                  onChange={(value) => setForm({ ...form, email: value })}
                />

                <InputField
                  label="Numéro de téléphone"
                  icon={<FaPhone />}
                  value={form.telephone}
                  onChange={(value) => setForm({ ...form, telephone: value })}
                />

                <div>
                  <label className="text-sm text-slate-500 block mb-2 font-semibold">
                    Rôle
                  </label>

                  <div className="relative">
                    <FaIdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      value={form.role}
                      readOnly
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button
                  onClick={saveProfile}
                  disabled={savingProfile || loading || !profileChanged}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  {savingProfile
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </div>

            {/* PASSWORD FORM */}
            <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                  <FaKey className="text-slate-800" />
                  Changement du mot de passe
                </h2>

                <p className="text-slate-500 mt-1">
                  Saisissez votre ancien mot de passe puis choisissez un nouveau
                  mot de passe sécurisé.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <PasswordField
                  label="Ancien mot de passe"
                  value={passwordForm.ancienMotDePasse}
                  show={showOldPassword}
                  onToggle={() => setShowOldPassword((prev) => !prev)}
                  onChange={(value) =>
                    setPasswordForm({
                      ...passwordForm,
                      ancienMotDePasse: value,
                    })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordField
                    label="Nouveau mot de passe"
                    value={passwordForm.nouveauMotDePasse}
                    show={showNewPassword}
                    onToggle={() => setShowNewPassword((prev) => !prev)}
                    onChange={(value) =>
                      setPasswordForm({
                        ...passwordForm,
                        nouveauMotDePasse: value,
                      })
                    }
                  />

                  <PasswordField
                    label="Confirmation"
                    value={passwordForm.confirmationMotDePasse}
                    show={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((prev) => !prev)}
                    onChange={(value) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmationMotDePasse: value,
                      })
                    }
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700 font-medium">
                  Le nouveau mot de passe doit contenir au moins 6 caractères.
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button
                  onClick={savePassword}
                  disabled={savingPassword || loading || !passwordReady}
                  className="bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaLock />
                  {savingPassword
                    ? "Modification..."
                    : "Modifier le mot de passe"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

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

function InputField({ label, value, onChange, icon, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-slate-500 block mb-2 font-semibold">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
        />
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="text-sm text-slate-500 block mb-2 font-semibold">
        {label}
      </label>

      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}