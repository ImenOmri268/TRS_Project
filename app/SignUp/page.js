'use client'

import SignUpForm from "@/components/signIn/SignUpForm";
import React from "react";

const SignUp = () => {
  return (
  <div className="bg-gradient-to-b from-[#A7BCEB] to-white min-h-screen flex flex-col md:flex-row justify-center items-center gap-12 md:gap-12 lg:gap-16 p-4">
      <div className="text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6F8CE8] mb-4">
          Bienvenue !
        </h1>
        <h4 className="text-base sm:text-lg md:text-xl text-[#6F8CE8] text-center">
          Veuillez saisir vos <br />
          coordonnées pour créer <br />
          un compte.
        </h4>
      </div>
      <SignUpForm></SignUpForm>
    </div>
  )
};

export default SignUp;
