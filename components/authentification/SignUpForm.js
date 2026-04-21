import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignUpForm = () => {
    return(
  <div className='bg-white rounded-2xl w-full max-w-md p-6  shadow-lg'>
      <h1 className='font-semibold text-[#4A72A7] text-center text-3xl mb-6'>
        DEMANDE
      </h1>
      
      <form  className='space-y-4' >
        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3  ' >
          <div className='mr-3'>
            <Image 
              src="/companyName.svg"
              alt='company icon' 
              width={20}
              height={20}
              
            />
          </div>
          <input 
            className='bg-transparent flex-1 outline-none text-white text-left  '
            type="text"
            placeholder="Nom de l'entreprise"
            >
          </input>
        </div>

        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3  ' >
          <div className='mr-3'>
            <Image 
              src="/rue.svg"
              alt='rue icon' 
              width={20}
              height={20}
              
            />
          </div>
          <input
            className='bg-transparent flex-2 outline-none text-white text-left  '
            type="text"
            placeholder="rue de l'entreprise"
            >
          </input>
        </div>

        <div className="flex flex-row gap-4">
          <div className='bg-[#9FB2F0] rounded-2xl flex  items-center px-4 py-3 w-[40%]  ' >
            <div className='mr-3 shrink-0'>
              <Image 
                src="/postalCode.svg"
                alt='postal code icon' 
                width={20}
                height={20}
                
              />
            </div>
            <input 
              className='bg-transparent flex-1  outline-none text-white   '
              type="text"
              placeholder="Code postal"
              >
            </input>
          </div>
          <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3  w-[55%]   ' >
            <div className='mr-3 shrink-0 '>
              <Image 
                src="/city.svg"
                alt='city icon' 
                width={20}
                height={20}
                
              />
            </div>
            <input 
              className='bg-transparent flex-1 outline-none text-white text-left '
              type="text"
              placeholder="Ville"
              >
            </input>
          </div>
        </div>
        
        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3  ' >
          <div className='mr-3 '>
            <Image 
              src="/phoneNumber.svg"
              alt='phone number icon' 
              width={20}
              height={20}
              
            />
          </div>
          <input 
            className='bg-transparent flex-1 outline-none text-white text-left  '
            type="text"
            placeholder="Numéro de téléphone"
            >
          </input>
        </div>
        
        <div className="bg-[#9FB2F0] rounded-2xl flex py-3 px-4 items-center"> 
          <div className="mr-3" >
            <Image 
              src="/email.svg"
              alt='email icon' 
              width={20}
              height={20}
              
            />
          </div>
           
          <input 
          className="bg-transparent text-white text-left flex-1 outline-none "
          type='email'
          placeholder="Veuillez entrer l&apos;email de l&apos;entreprise"
          ></input>
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
