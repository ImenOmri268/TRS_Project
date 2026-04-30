'use client'
import Image from "next/image";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const SignOut = () => {
  const router = useRouter();
  async function handlerLogout(event) {
    event.preventDefault();
    try{
      const res = await fetch ('/api/auth/logout',{
        method:'POST'
      });
      if (res.ok){
        toast.success('Déconnexion réussie !');
        router.push('/');
      }else{
        toast.error('Erreur lors de la déconnexion');
      }
    }catch(error){
      toast.error('Erreur lors de la déconnexion')
    }
  }

  return (
    <form className="grid mt-[25%] rounded-lg cursor-pointer"  onSubmit={handlerLogout} >

        <hr className="text-gray-500  "  />

        <div className="flex gap-4 hover:text-[rgb(70,71,75)] m-5  cursor-pointer    ">  
          <Image
            src="/logout.svg"
            alt="dashboard icon"
            width={45}
            height={45}
            className="md:h-[35] w-[35]"
            >
            </Image>
            <button 
            className="text-[#8B8F98] font-inter md:text-xl lg:text-2xl  my-0.5 cursor-pointer   " 
            type="submit"
            >
                  Déconnexion
            </button>
        </div>
      </form>
  );
};

export default SignOut;
