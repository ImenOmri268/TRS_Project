import { FaBell } from "react-icons/fa";

const NotifButton = ({ showNotif, setShowNotif }) => {
  return (
    <button 
      className="p-2 relative hover:bg-slate-100 rounded-full transition-colors"
      onClick={() => setShowNotif(!showNotif)}
    >
      <FaBell className={`w-5 h-5 ${showNotif ? "text-[#3B82F6]" : "text-slate-600"}`} />
      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
    </button> 
  )
};
export default NotifButton;
