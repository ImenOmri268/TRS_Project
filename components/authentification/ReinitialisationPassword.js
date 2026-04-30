'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

const ReinitialisationPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  
  const token = searchParams.get('token');
  
  const [showNew, setShowNew] = useState(true);
  const [showConfirm, setShowConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handlerFormSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');

      // Verif les 2 mdps identique
      if (newPassword !== confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas.');
        return;
      }

      // Verif long mdp
      if (newPassword.length < 6) {
        toast.error('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }

      //cas1:1er cnx (changer mdp obligatoir) -> cookie JWT
      //cas2:mdp oublié -> token dans URL
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, token })
        // token=null si 1ère connexion
        // token='trs123' si mdp oublié
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success('Mot de passe modifié avec succès !');
      router.push('/');

    } catch (error) {
      toast.error('Erreur, réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-lg'>
      <h1 className='font-semibold text-[#4A72A7] text-center text-3xl mb-8'>
        NOUVEAU MOT DE PASSE
      </h1>

      <form className='space-y-4' onSubmit={handlerFormSubmit}>

        {/*nv mdp*/}
        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3'>
          <div className='mr-3'>
            <Image src="/lock.svg" alt='lock icon' width={20} height={20} />
          </div>
          <input
            className='bg-transparent flex-1 outline-none text-white placeholder-white/70'
            type={showNew ? 'password' : 'text'}
            name='newPassword'
            placeholder='Nouveau mot de passe'
            required
          />
          <span>
            {showNew
              ? <FaEye className='text-white text-lg cursor-pointer hover:text-gray-300' onClick={() => setShowNew(false)} />
              : <FaEyeSlash className='text-white text-lg cursor-pointer hover:text-gray-300' onClick={() => setShowNew(true)} />
            }
          </span>
        </div>

        {/*confirm mdp*/}
        <div className='bg-[#9FB2F0] rounded-2xl flex items-center px-4 py-3'>
          <div className='mr-3'>
            <Image src="/lock.svg" alt='lock icon' width={20} height={20} />
          </div>
          <input
            className='bg-transparent flex-1 outline-none text-white placeholder-white/70'
            type={showConfirm ? 'password' : 'text'}
            name='confirmPassword'
            placeholder='Confirmer le mot de passe'
            required
          />
          <span>
            {showConfirm
              ? <FaEye className='text-white text-lg cursor-pointer hover:text-gray-300' onClick={() => setShowConfirm(false)} />
              : <FaEyeSlash className='text-white text-lg cursor-pointer hover:text-gray-300' onClick={() => setShowConfirm(true)} />
            }
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className='w-full bg-[#4A72A7] hover:bg-[#2c4a73] disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition duration-200'
        >
          {loading ? 'Enregistrement...' : 'MODIFIER LE MOT DE PASSE'}
        </button>
      </form>

      <p className='text-center text-gray-600 mt-6 text-sm'>
        Retour à la
        <Link href="/" className='text-[#4A72A7] hover:text-[#2c4a73] font-semibold hover:underline ml-1'>
          Connexion
        </Link>
      </p>
    </div>
  );
};

export default ReinitialisationPassword;