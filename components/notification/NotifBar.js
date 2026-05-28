import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MdClose } from "react-icons/md";

const NotifBar = ({ showNotif, setShowNotif, adminId }) => {
  const [notifications, setNotifications] = useState([]);

  // 1. Charger les notifications
  const fetchNotifications = async () => {
    if (!adminId) return;
    try {
      const res = await fetch(`/api/admin/notifications?adminId=${adminId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des notifications", err);
    }
  };

  // 2. Marquer comme lu à l'ouverture de la barre
  const markAsRead = async () => {
    if (!adminId) return;
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId })
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showNotif) {
      fetchNotifications();
      markAsRead();
    }
  }, [showNotif, adminId]);

  // 3. Tout supprimer
  const handleDeleteAll = async () => {
    if (!adminId) return;
    try {
      const res = await fetch(`/api/admin/notifications?adminId=${adminId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {showNotif && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-12 right-3 w-80 bg-white shadow-xl border border-slate-200 rounded-xl z-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100 ">
            <span className="font-semibold text-slate-800">Notifications</span>
            <MdClose className="cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setShowNotif(false)} />
          </div>
          <div className="p-4 min-h-50 max-h-96 overflow-y-auto">
            <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">Récent</span>
            
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">Aucune nouvelle notification</div>
            ) : (
              <div className="mt-2 space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="text-xs border-b border-slate-50 pb-2 last:border-none">
                    <p className="text-slate-700 font-medium">
                      <span className="text-blue-600 font-semibold">{notif.createdBy || "Utilisateur"}</span> : {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(notif.date).toLocaleDateString()} à {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleDeleteAll}
            className="w-full py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 cursor-pointer"
          >
            SUPPRIMER TOUT
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotifBar;