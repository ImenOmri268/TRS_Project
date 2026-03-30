import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignUpForm = () => {
    return(
  <div className='bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-lg'>
      <h1 className='font-semibold text-[#4A72A7] text-center text-3xl mb-6 sm:mb-8'>
        INSCRIPTION
      </h1>
      
      <form action="GET" className='space-y-4'>
        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3'>
          <div className='mr-3'>
            <Image 
              src="/username.svg"
              alt='profil icon' 
              width={20}
              height={20}
              className='w-5 h-5'
            />
          </div>
          <input 
            className='bg-transparent flex-1 outline-none text-white placeholder-white/70'
            type="text" 
            placeholder='nom d&apos;utilisateur'
          />
        </div>

        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3'>
          <div className='mr-3'>
            <Image 
              src="/role.svg"
              alt='role icon' 
              width={20}
              height={20}
              className='w-5 h-5'
            />
          </div>
          <select id="role" name="role" className="border border-transparent focus:border-transparent rounded-2xl  text-white bg-[#9FB2F0]" defaultValue={1}>
            <option value="admin">admin</option>
            <option value="super-admin" >super-admin</option>
            <option value="technicien">technicien</option>
            <option value="responsable qualité">responsable qualité</option>
          </select>
        </div>

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
            placeholder='mots de passe'
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
            placeholder='confirmation de mots de passe'
          />
        </div>

        <p className='text-center text-gray-600 mt-6 text-sm'>
        En vous inscrivant, vous acceptez nos Conditions d&apos;utilisation et notre Politique de confidentialité.
        </p>
        
        
        <button 
          type="submit"
          className='w-full bg-[#4A72A7] hover:bg-[#2c4a73] text-white font-semibold py-3 rounded-2xl transition duration-200'
        >
          S&apos;INSCRIRE
        </button>
      </form>
      
        
      <p className='text-center text-gray-600 mt-6 text-sm'>
        Vous avez déjà un compte ?
        
        <Link href="/" className='text-[#4A72A7] hover:text-[#2c4a73] font-semibold hover:underline'>
          Connexion
        </Link>
      </p>
    </div>
    )
};

export default SignUpForm;
