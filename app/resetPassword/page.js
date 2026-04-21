import ReinitialisationPassword from "@/components/authentification/ReinitialisationPassword";
import React from "react";

const page = () => {
  return (
    <div className="bg-gradient-to-b from-[#A7BCEB] to-white min-h-screen flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-16  ">
      <div className="text-center ">
        <h1 className="text-5xl  md:text-5xl lg:text-6xl  font-bold text-[#6F8CE8] mb-4 ">
          Bienvenue !
        </h1>
        <h4 className="text-lg md:text-lg lg:text-xl text-[#6F8CE8]  md:w-60 lg:w-80">
          Veuillez saisir et confirmer votre nouveau mot de passe.
        </h4>
      </div>
      <ReinitialisationPassword/>
    </div>
  )
};

export default page;
