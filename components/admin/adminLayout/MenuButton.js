import { MdMenu, MdClose } from "react-icons/md";

const MenuButton = ({ open, setOpen }) => {
  return (
    <button 
      onClick={() => setOpen(!open)}
      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
    >
      {open ? 
      <MdMenu className="text-2xl" /> 
      : <MdClose className="text-2xl" />}
    </button>
  )
};
export default MenuButton;