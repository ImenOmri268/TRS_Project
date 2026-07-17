import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

const NotifButton = ({ showNotif, setShowNotif }) => {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnread = async () => {
      try {
        // Points directly to the user notifications endpoint
        const res = await fetch(`/api/user/notifications`);
        if (res.ok) {
          const notifications = await res.json();
          // Checks if there is at least one notification where lu is false
          setHasUnread(notifications.some(n => !n.lu));
        }
      } catch (err) {
        console.error("Erreur vérification notifications utilisateur:", err);
      }
    };

    checkUnread();
    
    // Polling setup checking every 30 seconds
    const interval = setInterval(checkUnread, 30000);
    return () => clearInterval(interval);
  }, [showNotif]);

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