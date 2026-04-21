'use client'
import { doSignIn } from '@/app/actions'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import { toast } from 'sonner'

const SignInForm = () => {

  const router=useRouter();
  

  async function handlerFormSubmit(event){
    event.preventDefault();
    try{
      const formData = new FormData(event.currentTarget);
      const response =await doSignIn(formData);
      if(!!response.error)
      {
        toast.error(response.error);
      }else{
        router.push('/Dashboard');
        toast.success('Logged in!');
      }
    }catch(error){
      toast.error( 'verifiez vos cordoonees');
    }
  }


  const [show,setshow]=useState(true);

  function handle(){
    setshow(!show);
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
            <FaEye  className='text-white text-lg cursor-pointer hover:text-gray-300' onClick={handle} />)
            :(<FaEyeSlash className='text-white text-lg cursor-pointer hover:text-gray-300' onClick={handle} />)
            }
          </span>
          
        </div>
        

        <div className='flex flex-row sm:flex-row items-start sm:items-center justify-between gap-3'>
          <label className='flex items-center cursor-pointer'>
            <input 
              type="checkbox" 
              className='w-4 h-4 rounded border-gray-300 text-[#4A72A7] focus:ring-[#4A72A7] cursor-pointer'
            />
            <span className='ml-2 text-sm text-gray-700'>Se souvenir de moi</span>
          </label>
          <a href="/EmailSend" className='text-sm text-[#4A72A7] hover:text-[#2c4a73] hover:underline'>
            Mot de passe oublié ?
          </a>
        </div>
        
        
        
        <button 
          type="submit"
          className='w-full bg-[#4A72A7] hover:bg-[#2c4a73] text-white font-semibold py-3 rounded-2xl transition duration-200'
        >
          CONNEXION
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