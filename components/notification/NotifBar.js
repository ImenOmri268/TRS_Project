'use client'
import { AnimatePresence, motion } from "framer-motion";
import { MdClose, MdOutlineQueryStats, MdOutlineCheckCircle, MdOutlineBuild } from "react-icons/md";

const NotifBar = ({ showNotif, setShowNotif }) => {
  const FAKE_NOTIFICATIONS = [
  {
    id: 1,
    type: "TRS_ALERT",
    title: "Alerte Performance",
    message: "Le TRS de la Ligne A est descendu à 68%.",
    time: "Il y a 5 min",
    isUnread: true,
  },
  {
    id: 2,
    type: "GOAL_SUCCESS",
    title: "Objectif Atteint",
    message: "Félicitations ! Le cap des 85% de qualité est franchi.",
    time: "Il y a 2h",
    isUnread: true,
  },
  {
    id: 3,
    type: "MAINTENANCE",
    title: "Maintenance Requise",
    message: "Calibration prévue pour le Capteur B2 demain.",
    time: "Hier",
    isUnread: false,
  }
];
  
  // Dynamic Icon selector
  const getIcon = (type) => {
    switch (type) {
      case "TRS_ALERT": return <MdOutlineQueryStats className="text-rose-600" />;
      case "GOAL_SUCCESS": return <MdOutlineCheckCircle className="text-emerald-600" />;
      case "MAINTENANCE": return <MdOutlineBuild className="text-blue-600" />;
      default: return <MdOutlineQueryStats className="text-slate-400" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "TRS_ALERT": return "bg-rose-50";
      case "GOAL_SUCCESS": return "bg-emerald-50";
      case "MAINTENANCE": return "bg-blue-50";
      default: return "bg-slate-50";
    }
  };

  return (
    <AnimatePresence>
      {showNotif && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          className="absolute top-14 right-4 w-[350px] bg-white shadow-2xl border border-slate-200 rounded-[2rem] z-[100] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <span className="font-black text-slate-800 tracking-tight uppercase text-sm">Centre de Notifications</span>
            <button 
              onClick={() => setShowNotif(false)}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <MdClose className="text-slate-400 text-xl" />
            </button>
          </div>

          {/* List Content */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            <div className="px-6 py-4">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Récent</span>
            </div>

            <div className="flex flex-col">
              {FAKE_NOTIFICATIONS.length > 0 ? (
                FAKE_NOTIFICATIONS.map((notif) => (
                  <motion.div
                    key={notif.id}
                    whileHover={{ backgroundColor: "#f8fafc" }}
                    className={`px-6 py-4 flex gap-4 cursor-pointer relative transition-colors ${notif.isUnread ? 'bg-slate-50/50' : 'bg-white'}`}
                  >
                    {/* Unread Indicator */}
                    {notif.isUnread && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full" />
                    )}

                    {/* Icon Container */}
                    <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${getBgColor(notif.type)}`}>
                      {getIcon(notif.type)}
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight">{notif.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{notif.message}</p>
                      <span className="text-[10px] font-medium text-slate-400 mt-1">{notif.time}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                    <MdOutlineQueryStats className="text-slate-300 text-2xl" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Aucune nouvelle notification</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="grid grid-cols-2 border-t border-slate-100">
            <button className="py-4 text-[11px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-tighter">
              Marquer comme lu
            </button>
            <button className="py-4 text-[11px] font-black text-rose-500 hover:bg-rose-50 transition-all border-l border-slate-100 uppercase tracking-tighter">
              Supprimer tout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotifBar;