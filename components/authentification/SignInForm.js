'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import { toast } from 'sonner'

const SignInForm = () => {

  const router=useRouter();
  const [show, setShow] =  useState(true) ;
  //show(true):mdp masqué --> setShow(false): visible
  const [loading, setLoading]= useState(false) ;
  // loading=true → bouton désactivé + texte "Connexion..."
 // Évite que l'utilisateur clique 2 fois pendant la requête

  async function handlerFormSubmit(event){
    event.preventDefault(); 
    setLoading(true);  //desactiver le btn immediatement
    try{
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email');
      const password =formData.get('password');

      const res =await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if(!res.ok)
      {
        toast.error(data.message);
        return
      }
      
      toast.success('Connexion réussie !');
  
      if (data.mustChangePassword) {
        router.push('/resetPassword');
      }else {
        router.push('/admin/Dashboard')
      }

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion, réessayez.')
    } finally {
      setLoading(false)  //remet btn actif
    }
  }

  return (
    <div className='bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-lg'>
      <h1 className='font-semibold text-[#4A72A7] text-center text-3xl mb-8 '>
        CONNEXION
      </h1>
      
      <form  className='space-y-4' onSubmit={handlerFormSubmit} >
        <div className=' bg-[#9FB2F0] outline-none rounded-2xl flex items-center px-4 py-3'>
          <div className='mr-3'>
            <Image 
              src="/email.svg"
              alt='email icon' 
              width={20}
              height={20}
            />
          </div>
          <input 
            className='bg-transparent flex-1 outline-none text-white placeholder-white/70'
            type="email"
            name='email' 
            id='email'
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
            />
          </div>
          <input 
            className='bg-transparent flex-1 outline-none text-white placeholder-white/70'
            type={show? 'password': 'text'}
            name='password' 
            id='password'
            placeholder='mots de passe'
          />
          <span>
            {show?(
            <FaEye  className='text-white text-lg cursor-pointer hover:text-gray-300' onClick={() => setShow(false)} />)
            :(<FaEyeSlash className='text-white text-lg cursor-pointer hover:text-gray-300' onClick={() => setShow(true)} />)
            }
          </span>
          
        </div>
        

        <div className='flex flex-row   justify-center  gap-2'>
          <a href="/EmailSend" className='text-sm text-[#4A72A7] hover:text-[#2c4a73] hover:underline'>
            Mot de passe oublié ?
          </a>
        </div>
        
        
        
        <button 
          type="submit" disabled={loading}
          className='w-full bg-[#4A72A7] hover:bg-[#2c4a73] disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition duration-200'
        >
          {loading ? 'Connexion...' : 'CONNEXION'}
        </button>
      </form>
      
        
      <p className='text-center text-gray-600 mt-6 text-sm'>
        Vous n&apos;avez pas de compte ? 
        
        <Link href="/SignUp" className='text-[#4A72A7] hover:text-[#2c4a73] font-semibold hover:underline'>
          Inscrivez-vous
        </Link>
      </p>
    </div>
  )
}

export default SignInForm