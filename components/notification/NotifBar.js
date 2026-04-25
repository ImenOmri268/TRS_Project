import { AnimatePresence, motion } from "motion/react";
import { MdClose } from "react-icons/md";

const NotifBar = ({ showNotif, setShowNotif }) => {
  return (
    <AnimatePresence>
      {showNotif && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-12 right-0 w-80 bg-white shadow-xl border border-slate-200 rounded-xl z-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <span className="font-semibold text-slate-800">Notifications</span>
            <MdClose className="cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setShowNotif(false)} />
          </div>
          <div className="p-4  min-h-50">
            <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">Récent</span>
            <div className="py-8 text-center text-slate-400 text-sm">Aucune nouvelle notification</div>
          </div>
          <button className="w-full py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100">
            SUPPRIMER TOUT
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default NotifBar;
