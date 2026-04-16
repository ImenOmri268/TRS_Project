import Image from "next/image";
import Link from "next/link";
import React from "react";

const ReinitialisationPassword = () => {
  return (
    <div className='bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-lg'>
      <h1 className='font-semibold text-[#4A72A7] text-center text-3xl mb-6 sm:mb-8'>
        NOUVEAU MOT DE PASSE
      </h1>
      
      <form action="GET" className='space-y-4'>
        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3'>
          <div className='mr-3'>
            <Image 
              src="/lock.svg"
              alt='lock icon' 
              width={20}
              height={20}
              className='w-5 h-5'
            />
          </div>
          <input 
            className='bg-transparent flex-1 outline-none text-white placeholder-white/70'
            type="password" 
            placeholder='Nouveau mot de passe'
          />
        </div>
        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3'>
          <div className='mr-3'>
            <Image 
              src="/lock.svg"
              alt='lock icon' 
              width={20}
              height={20}
              className='w-5 h-5'
            />
          </div>
          <input 
            className='bg-transparent flex-1 outline-none text-white placeholder-white/70'
            type="password" 
            placeholder='confirmer le mot de passe'
          />
        </div>

        <button 
          type="submit"
          className='w-full bg-[#4A72A7] hover:bg-[#2c4a73] text-white font-semibold py-3 rounded-2xl transition duration-200'
        >
          MODIFIER LE MOT DE PASSE
        </button>
      </form>
      
        
      <p className='text-center text-gray-600 mt-6 text-sm'>
        Retour à la 
        
        <Link href="/SignIn" className='text-[#4A72A7] hover:text-[#2c4a73] font-semibold hover:underline'>
          Connexion
        </Link>
      </p>
    </div>
  )
};

export default ReinitialisationPassword;
