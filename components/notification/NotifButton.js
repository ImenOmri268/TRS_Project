import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

const NotifButton = ({ showNotif, setShowNotif, adminId }) => {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!adminId) return;

    const checkUnread = async () => {
      try {
        const res = await fetch(`/api/admin/notifications?adminId=${adminId}`);
        if (res.ok) {
          const notifications = await res.json();
          // Vérifie s'il y a au moins une notification non lue
          setHasUnread(notifications.some(n => !n.lu));
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkUnread();
    // Optionnel : polling toutes les 30 secondes pour mettre à jour la cloche
    const interval = setInterval(checkUnread, 30000);
    return () => clearInterval(interval);
  }, [adminId, showNotif]);

  return (
    <button 
      className="p-2 relative hover:bg-slate-100 rounded-full transition-colors"
      onClick={() => setShowNotif(!showNotif)}
    >
      <FaBell className={`w-5 h-5 ${showNotif ? "text-[#3B82F6]" : "text-slate-600"}`} />
      {hasUnread && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      )}
    </button> 
  );
};

export default NotifButton;