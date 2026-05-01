'use client'
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import {toast} from "sonner";

const emailcheck = () => {
  const [loading,setLoading]=useState(false);
  async function handleSubmit(event){
    event.preventDefault();
    setLoading(true);
    try{
      const formData= new FormData(event.currentTarget);
      const email = formData.get('email');

      const res = await fetch('/api/auth/reset-password',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email })
      })

      const data = await res.json();

      if(!res.ok){
        toast.error(data.message);
        return;
      }

      toast.success('Email envoyé ! Vérifiez votre boîte mail.');
      
    }catch(error){
      toast.error('Erreur, réessayez.')
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className='bg-white rounded-2xl w-full max-w-md p-6  shadow-lg'>
      <h1 className='font-semibold text-[#4A72A7] text-center text-2xl  mb-6 '>
        REINITIALISATION DE MOT DE PASSE
      </h1>
      
      <form className='space-y-4' onSubmit={handleSubmit}>
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
            name="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className='w-full bg-[#4A72A7] hover:bg-[#2c4a73] disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition duration-200'
          >
          {loading ? 'Envoi...' : 'ENVOYER LE LIEN DE REINITIALISATION'}
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
