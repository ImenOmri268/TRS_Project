'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import {toast} from "sonner";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const router=useRouter();
  const [loading, setLoading] =  useState(false) ;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try{
      const formData=new FormData(event.currentTarget);

      const nom = formData.get('nom');
      const rue = formData.get('rue');
      const codePostal = formData.get('codePostal');
      const ville = formData.get('ville');
      const telephone = formData.get('telephone');
      const email = formData.get('email');

      const res = await fetch('/api/demande',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom,rue,codePostal,ville,telephone,email })
      })

      const data = await res.json();

      if (!res.ok){
        toast.error(data.message);
        return;
      }

      toast.success('Demande envoyée ! Vérifiez votre email pour vos identifiants.');
      router.push('/');

    }catch(error){
      toast.error('Erreur, réessayez.');
    }finally{
      setLoading(false);
    }
    
  }
    return(
  <div className='bg-white rounded-2xl w-full max-w-md p-6  shadow-lg'>
      <h1 className='font-semibold text-[#4A72A7] text-center text-3xl mb-6'>
        DEMANDE
      </h1>
      
      <form  className='space-y-4' onSubmit={handleSubmit}>
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
            name="nom"
            required
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
            name="rue"
            required
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
              name="codePostal"
              required
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
              name="ville"
              required
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
            name="telephone"
            required
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
          name="email"
          required
          ></input>
        </div>
        
        <p className='text-center text-gray-600 mt-6 text-sm'>
        En vous inscrivant, vous acceptez nos Conditions d&apos;utilisation et notre Politique de confidentialité.
        </p>
        
        
        <button 
          type="submit"
          disabled={loading}
          className='w-full bg-[#4A72A7] hover:bg-[#2c4a73] disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition duration-200'
        >
          {loading? 'Envoi...': "S'INSCRIRE"}
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
