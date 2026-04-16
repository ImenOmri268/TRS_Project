import Image from "next/image";
import React from "react";

const AjoutButton = () => {
  return (
  <div className="flex justify-end py-10   "> 
    <div className="flex justify-center rounded-md gap-3 bg-[#366CD2] w-[20%] h-10">
      <Image
      src="ajout.svg"
      alt="ajout icon"
      width={15 }
      height={15}
      >
      </Image>
      <span className="text-white font-semibold text-center py-1.5"> Ajouter utilisateur</span>
    </div>
  </div>
)};

export default AjoutButton;
