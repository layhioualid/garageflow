import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaShieldAlt,
  FaHeadset,
  FaFileContract,
  FaCar,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FaCar />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-950">
                Garage<span className="text-blue-600">Flow+</span>
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Plateforme intelligente de gestion et maintenance des véhicules.
              </p>
            </div>
          </div>

          {/* CENTER LINKS */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <FooterLink icon={<FaHeadset />} label="Support" />
            <FooterLink icon={<FaShieldAlt />} label="Privacy" />
            <FooterLink icon={<FaFileContract />} label="Terms" />
          </div>

          {/* RIGHT SOCIALS */}
          <div className="flex items-center justify-center gap-2">
            <SocialButton icon={<FaEnvelope />} />
            <SocialButton icon={<FaLinkedin />} />
            <SocialButton icon={<FaGithub />} />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-slate-400 text-center md:text-left">
            © {currentYear} GarageFlow+. Tous droits réservés.
          </p>

          <p className="text-xs text-slate-400 text-center md:text-right">
            Smart fleet maintenance & vehicle analytics.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ icon, label }) {
  return (
    <button className="h-10 px-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-500 hover:text-blue-600 flex items-center gap-2 text-xs font-bold transition">
      {icon}
      {label}
    </button>
  );
}

function SocialButton({ icon }) {
  return (
    <button className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-slate-500 hover:text-white flex items-center justify-center transition">
      {icon}
    </button>
  );
}