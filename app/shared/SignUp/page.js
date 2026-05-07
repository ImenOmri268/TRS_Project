'use client'

import SignUpForm from "@/components/authentification/SignUpForm";
import React from "react";

const SignUp = () => {
  return (
  <div className="bg-gradient-to-b from-[#A7BCEB] to-white min-h-screen flex flex-col md:flex-row justify-center items-center gap-12 md:gap-12 lg:gap-16 ">
      <div className="text-center" >
        <h1 className="text-5xl  md:text-5xl lg:text-6xl  font-bold text-[#6F8CE8] mb-4">
          Bienvenue !
        </h1>
        <h4 className="text-lg md:text-xl text-[#6F8CE8] text-center md:w-60 lg:w-80">
          Veuillez saisir vos coordonnées pour créer un compte.
        </h4>
      </div>
      <SignUpForm></SignUpForm>
    </div>
  )
};

export default SignUp;
