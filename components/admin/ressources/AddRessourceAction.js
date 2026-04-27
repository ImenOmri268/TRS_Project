'use client'
import { useState } from "react";
import AjoutButton from "../adminLayout/AjoutButton"; // Reusing your existing button
import AjoutRessourceForm from "./AjoutRessourceForm";

export default function AddRessourceAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AjoutButton   setIsOpen={setIsOpen} title="Ajouter une ressource" />
      <AjoutRessourceForm 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}