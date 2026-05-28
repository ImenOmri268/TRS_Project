'use client'
import { useState } from "react";
import AjoutButton from "../userLayout/AjoutButton"; 
import AjoutRessourceForm from "./AjoutRessourceForm";

export default function AddRessourceAction({ refresh }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>

      <AjoutButton setIsOpen={setIsOpen} title="Ajouter une ressource" />
      
      <AjoutRessourceForm 
        isOpen={isOpen} 
        onClose={handleClose}
        refresh={refresh} // Pass the refresh function down
      />
    </>
  );
}