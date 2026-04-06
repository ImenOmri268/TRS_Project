import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
const page = async () => {
  const session = await auth();
  if(!session?.user) redirect("/SignUp");
  return (
    <div className="bg-gradient-to-b from-[#A7BCEB] to-white min-h-screen flex flex-col justify-center items-center gap-12 p-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6F8CE8] mb-4">
        Bienvenue Admin!
      </h1>
      <Image 
        src={session?.user?.image }
        alt={session?.user?.name}
        width={100}
        height={100}
        className='w-24 h-24'
       />
       
      <h4 className="text-base sm:text-lg md:text-xl text-[#6F8CE8] text-center">
        Vous êtes connecté en tant que {session?.user?.email}
      </h4>
    </div>
  )

  

};

export default page;
