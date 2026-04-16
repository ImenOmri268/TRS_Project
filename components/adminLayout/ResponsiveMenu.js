import React, { act } from "react";
import SignOut from "../signIn/SignOut";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";


const ResponsiveMenu = ({ open,page}) => {
    
    const [activeitem, setctiveitem] = React.useState(page);
    
    
  return (
    <AnimatePresence mode="wait">
      {!open && (
            <motion.nav
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-1/5 h-full bg-[#0F172A] shadow-xl "
            >
          
                    <div className="text-[#3B82F6] font-serif text-center text-6xl p-2  ">
                        ADMIN
                    </div>
                    <hr className="text-gray-500" />
          
                    <div className="grid mt-13  cursor-pointer">
            
                        <Link href="/Dashboard" className={`flex gap-4 ${activeitem == "Dashboard" ? "bg-[#3B82F6]" : "hover:bg-[#3B82F6]"} p-3`}  setctivetem={"Dashboard"}>
                            <div className="flex justify-center gap-4 ">
                                <Image
                                src="/dashboard.svg"
                                alt="dashboard icon"
                                width={50}
                                height={50}
                                >
                                </Image>
                                <span  className="text-white font-inter text-2xl my-0.5  ">Dashboard</span>
                            </div>
                        </Link>


                        <Link href="/Utilisateurs" className={`flex gap-4 ${activeitem == "Liste des utilisateurs" ? "bg-[#3B82F6]" : "hover:bg-[#3B82F6]"} p-3`} setactiveitem={"Liste des utilisateurs"}>
                            <div className="flex justify-center gap-4   ">
                                <Image
                                src="/utilisateur.svg"
                                alt="utilisateur icon"
                                width={50}
                                height={50}
                                >
                                </Image>
                                <span  className="text-white font-inter text-2xl my-0.5  ">Utilisateurs</span>
                            </div>
                        </Link>


                        <Link  href="/Ressources" className={`flex gap-4 ${activeitem == "Les ressources" ? "bg-[#3B82F6]" : "hover:bg-[#3B82F6]"} p-3`} setactiveitem={"Les ressources"}>
                            <div   className="flex justify-center gap-4">
                                <Image
                                src="/machine.svg"
                                alt="dashboard icon"
                                width={50}
                                height={50}
                                >
                                </Image>
                                <span className="text-white font-inter text-2xl my-0.5">Ressources</span>
                            </div>
                        </Link>


                        <Link href="/ConfigTRS" className={`flex gap-4 ${activeitem == "Configuration TRS" ? "bg-[#3B82F6]" : "hover:bg-[#3B82F6]"} p-3`} setactiveitem={"Configuration TRS"}>
                            <div  className="flex justify-center gap-4   ">
                                <Image
                                src="/configuration.svg"
                                alt="dashboard icon"
                                width={50}
                                height={50}
                                >
                                </Image>
                                <span  className="text-white font-inter text-2xl my-0.5  ">Configuration TRS</span>
                            </div>
                        </Link>


                        <Link href="/Rapports" className={`flex gap-4 ${activeitem == "Les rapports" ? "bg-[#3B82F6]" : "hover:bg-[#3B82F6]"} p-3`} setactiveitem={"Les rapports"}>
                            <div  className="flex justify-center gap-4   ">
                                <Image
                                src="/rapport.svg"
                                alt="dashboard icon"
                                width={50}
                                height={50}
                                >
                                </Image>
                                <span  className="text-white font-inter text-2xl my-0.5  ">Rapports</span>
                            </div>
                        </Link>


                        <Link href="/CollecteDonnees" className={`flex gap-4 ${activeitem == "Collecte de donnees" ? "bg-[#3B82F6]" : "hover:bg-[#3B82F6]"} p-3`} setactiveitem={"Collecte de donnees"}>
                            <div  className="flex justify-center gap-4   ">
                                <Image
                                src="/collecte.svg"
                                alt="collecte icon"
                                width={50}
                                height={50}
                                >
                                </Image>
                                <span  className="text-white font-inter text-2xl my-0.5  ">Collecte données</span>
                            </div>
                        </Link>


                        <Link href="/AnalyzeProbs" className={`flex gap-4 ${activeitem == "Analyse de problemes" ? "bg-[#3B82F6]" : "hover:bg-[#3B82F6]"} p-3`} setactiveitem={"Analyse de problemes"}>
                            <div  className="flex justify-center gap-4   ">
                                <Image
                                src="/analyze.svg"
                                alt="analyze icon"
                                width={50}
                                height={50}
                                >
                                </Image>
                                <span  className="text-white font-inter text-2xl my-0.5  ">Analyse Probs</span>
                            </div>
                        </Link>

                    </div>

                    <SignOut />
                    
                
            </motion.nav>



        )
        }
    </AnimatePresence>
  )
};

export default ResponsiveMenu;
