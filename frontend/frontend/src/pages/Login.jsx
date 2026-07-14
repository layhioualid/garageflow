import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { login, saveAuth } from "../services/auth.service";

import {
  FaCar,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignInAlt,
  FaExclamationTriangle,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    motDePasse: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {
      setForm((prev) => ({
        ...prev,
        email: savedEmail,
      }));
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.motDePasse) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await login(form);
        saveAuth(res.data);

        const user = res.data?.user || res.data;

        if (remember) {
          localStorage.setItem("rememberEmail", form.email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        if (user.role === "TECHNICIEN") {
          navigate("/technicien/interventions", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
    } catch (err) {
      console.error("Erreur login complète :", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response) {
        setError("Erreur backend : " + err.response.status);
      } else {
        setError("Impossible de contacter le backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setForm({
      email: "admin@garageflow.com",
      motDePasse: "123456",
    });

    setError("");
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-950">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
        {/* LEFT SIDE */}
        <section className="relative hidden lg:flex overflow-hidden text-white">
          <div className="absolute inset-0 bg-slate-950" />

          <motion.div
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="/images/login-maintenance-truck.png"
              alt="Maintenance truck"
              className="h-full w-full object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

          <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-[130px]" />
          <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-[130px]" />

          <div className="relative z-10 flex h-full w-full flex-col px-16 py-10 xl:px-24">
            {/* BRAND */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur">
                  <FaCar className="text-2xl text-cyan-200" />
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight">
                    Garage<span className="text-cyan-300">Flow+</span>
                  </h1>
                  <p className="text-sm text-slate-300">
                    Fleet Management Platform
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
                Secure Portal
              </div>
            </motion.div>

            {/* HERO */}
            <div className="flex flex-1 flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="max-w-2xl"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
                  <FaShieldAlt className="text-cyan-300" />
                  Accès administrateur sécurisé
                </div>

                <h2 className="text-4xl font-black leading-[1.05] tracking-tight xl:text-5xl 2xl:text-6xl">
                  Gérez votre garage avec une interface claire et intelligente
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                  Centralisez les véhicules, les interventions, les clients, les
                  devis, les factures et les stocks dans une plateforme moderne.
                </p>

                <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                  <Feature label="Flotte" />
                  <Feature label="Stock" />
                  <Feature label="Finance" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#f8fafc] px-5 py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.10),transparent_32%),radial-gradient(circle_at_90%_90%,rgba(34,211,238,0.12),transparent_34%)]" />

          <div className="absolute right-10 top-16 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
          <div className="absolute bottom-16 left-10 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />

          <div className="relative z-10 w-full max-w-[430px]">
            {/* MOBILE BRAND */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <FaCar />
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-950">
                  Garage<span className="text-blue-600">Flow+</span>
                </h1>
                <p className="text-xs font-medium text-slate-500">
                  Connexion sécurisée
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-[34px] border border-white bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl"
            >
              <div className="mb-7">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                  <FaLock className="text-xl" />
                </div>

                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  Connexion
                </h2>

                <p className="mt-2 text-slate-500">
                  Accédez à votre tableau de bord professionnel.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
                >
                  <FaExclamationTriangle className="mt-1 shrink-0" />
                  <p className="text-sm font-semibold">{error}</p>
                </motion.div>
              )}

              <form onSubmit={submit} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Email
                  </label>

                  <div className="relative mt-2">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="admin@garageflow.com"
                      autoComplete="email"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/90 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Mot de passe
                  </label>

                  <div className="relative mt-2">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.motDePasse}
                      onChange={(e) =>
                        setForm({ ...form, motDePasse: e.target.value })
                      }
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/90 py-4 pl-12 pr-12 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* OPTIONS */}
                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-500">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Se souvenir de moi
                  </label>

                  <button
                    type="button"
                    className="font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.22)_50%,rgba(255,255,255,0)_100%)] transition duration-1000 group-hover:translate-x-[100%]" />

                  <span className="relative flex items-center gap-2">
                    <FaSignInAlt />
                    {loading ? "Connexion..." : "Se connecter"}
                    {!loading && <FaArrowRight />}
                  </span>
                </button>
              </form>
            </motion.div>

            <p className="mt-6 text-center text-xs text-slate-400">
              © 2026 GarageFlow+ — Gestion professionnelle de garage
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Feature({ label }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-slate-200 backdrop-blur">
      <FaCheckCircle className="text-cyan-300" />
      {label}
    </div>
  );
}