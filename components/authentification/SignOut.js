

import Image from "next/image";
import React from "react";

const SignOut = () => {

  

  return (
    <form className="grid mt-[25%] rounded-lg cursor-pointer"   >

        <hr className="text-gray-500  "  />

        <div className="flex gap-4 hover:text-[rgb(70,71,75)] m-5  cursor-pointer    ">  
          <Image
            src="/logout.svg"
            alt="dashboard icon"
            width={45}
            height={45}
            >
            </Image>
            <button 
            className="text-[#8B8F98] font-inter text-2xl my-0.5 cursor-pointer  " 
            type="submit"
            >
                  Déconnexion
            </button>
        </div>
      </form>
  );
};

export default SignOut;
