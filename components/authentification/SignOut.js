import Image from "next/image";
import React from "react";

const SignOut = () => {
  return (
    <form className="mt-auto  ">
      <div className="flex items-center gap-3 px-6 py-6 group cursor-pointer transition-colors hover:bg-slate-800/50">
        <div className="opacity-70 group-hover:opacity-100 transition-opacity">
          <Image
            src="/logout.svg"
            alt="logout icon"
            width={24}
            height={24}
            className="brightness-200" // Keeps the icon visible on dark background
          />
        </div>
        
        <button
          className="text-slate-400 font-sans text-sm font-medium group-hover:text-white transition-colors"
          type="submit"
        >
          Déconnexion
        </button>
      </div>
    </form>
  );
};

export default SignOut;