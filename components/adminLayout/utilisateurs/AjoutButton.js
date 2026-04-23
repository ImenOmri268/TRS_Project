import Image from "next/image";
import React from "react";

const AjoutButton = () => {
  return (
  <div className="cursor-pointer flex justify-center rounded-xl lg:rounded-2xl mt-10 mb-10 bg-[#3B82F6] w-40  lg:w-50 "> 
    <div className="flex justify-center gap-3   ">
      <Image
      src="ajout.svg"
      alt="ajout icon"
      width={10}
      height={10}
      className=""
      >   
      </Image>
      <span className="text-white font-semibold text-center py-1.5 text-sm lg:text-2xl  "> Ajouter utilisateur</span>
    </div>
  </div>
)};

export default AjoutButton;
