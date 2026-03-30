import ReinitialisationPassword from "@/components/ReinitialisationPassword";
import React from "react";

const page = () => {
  return (
    <div className="bg-gradient-to-b from-[#A7BCEB] to-white min-h-screen flex flex-col md:flex-row justify-center items-center gap-12 md:gap-12 lg:gap-16 p-4">
      <div className="text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6F8CE8] mb-4">
          Bienvenue !
        </h1>
        <h4 className="text-base sm:text-lg md:text-xl text-[#6F8CE8] text-center">
          Veuillez saisir et confirmer <br />
          votre nouveau mot de passe. <br />
        </h4>
      </div>
      <ReinitialisationPassword/>
    </div>
  )
};

export default page;
