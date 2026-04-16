import Image from "next/image";
import Link from "next/link";
import React from "react";

const emailcheck = () => {
  return (
    <div className='bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-lg'>
      <h1 className='font-semibold text-[#4A72A7] text-center text-3xl mb-6 sm:mb-8'>
        REINITIALISATION DE MOT DE PASSE
      </h1>
      
      <form action="GET" className='space-y-4'>
        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3'>
          <div className='mr-3'>
            <Image 
              src="/email.svg"
              alt='email icon' 
              width={20}
              height={20}
              className='w-5 h-5'
            />
          </div>
          <input 
            className='bg-transparent flex-1 outline-none text-white placeholder-white/70'
            type="email" 
            placeholder='Email'
          />
        </div>

        <button 
          type="submit"
          className='w-full bg-[#4A72A7] hover:bg-[#2c4a73] text-white font-semibold py-3 rounded-2xl transition duration-200'
        >
          ENVOYER LE LIEN DE <br/> REINITIALISATION
        </button>
      </form>
      
      <div className="flex items-center space-x-1 justify-center mt-3">
        <p className='text-center text-gray-600 '>
        Retour à la 
        </p>
        <Link href="/" className='text-[#4A72A7] hover:text-[#2c4a73] font-semibold hover:underline'>
          Connexion
        </Link>
      </div>  
      
    </div>
  )
};

export default emailcheck;
