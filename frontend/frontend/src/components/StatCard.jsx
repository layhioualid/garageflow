import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "text-blue-400",
  suffix = "",
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;

    const duration = 800;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(timer);
      }

      setCount(Math.floor(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative bg-white/5 border border-white/10 rounded-2xl p-5 overflow-hidden"
    >

      {/* glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition" />

      <div className="relative flex items-center justify-between">

        {/* TEXT */}
        <div>

          <p className="text-gray-400 text-sm">
            {title}
          </p>

          <h2 className={`text-3xl font-bold mt-1 ${color}`}>
            {count}{suffix}
          </h2>

        </div>

        {/* ICON */}
        {Icon && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <Icon className="text-xl text-blue-400" />
          </div>
        )}

      </div>

    </motion.div>
  );
}