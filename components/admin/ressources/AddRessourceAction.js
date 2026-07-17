'use client'
import { useState } from "react";
import AjoutButton from "../adminLayout/AjoutButton"; 
import AjoutRessourceForm from "./AjoutRessourceForm";

export default function AddRessourceAction({ refresh }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 
          Reusing your existing button. 
          The refresh prop is passed to the form to trigger a data reload 
          on the main page after a successful POST request.
      */}
      <AjoutButton setIsOpen={setIsOpen} title="Ajouter une ressource" />
      
      <AjoutRessourceForm 
        isOpen={isOpen} 
        onClose={handleClose}
        refresh={refresh} // Pass the refresh function down
      />
    </>
  );
}