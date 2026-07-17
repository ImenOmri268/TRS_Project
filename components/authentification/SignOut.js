'use client'
import Image from "next/image";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const SignOut = () => {
  const router = useRouter();
  
  async function handlerLogout(event) {
    event.preventDefault();
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      if (res.ok) {
        toast.success('Déconnexion réussie !');
        router.push('/');
      } else {
        toast.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  return (
    <form onSubmit={handlerLogout} className="w-full">
      <button 
        type="submit"
        className="flex items-center gap-3 px-6 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
      >
        <div className="relative w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity">
          <Image
            src="/logout.svg"
            alt="logout icon"
            fill
            className="brightness-200"
          />
        </div>
        <span className="text-sm font-medium">Déconnexion</span>
      </button>
    </form>
  );
};

export default SignOut;