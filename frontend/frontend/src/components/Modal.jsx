import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Modal({ open, setOpen, title, children }) {

  const [drag, setDrag] = useState({ x: 0, y: 0 });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center
          bg-white/5 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          {/* BACKDROP CLICK */}
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          {/* MODAL DRAGGABLE */}
          <motion.div
            drag
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={(e, info) => setDrag({ x: info.point.x, y: info.point.y })}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="absolute w-[420px] rounded-2xl
            bg-white/5 backdrop-blur-2xl border border-white/10
            shadow-2xl text-white overflow-hidden"
          >

            {/* HEADER = DRAG HANDLE */}
            <div className="cursor-grab active:cursor-grabbing
            px-5 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">

              <h3 className="font-semibold">{title}</h3>

              <button
                onClick={() => setOpen(false)}
                className="px-2 py-1 hover:bg-white/10 rounded-lg"
              >
                ✕
              </button>

            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-3">
              {children}
            </div>

          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}