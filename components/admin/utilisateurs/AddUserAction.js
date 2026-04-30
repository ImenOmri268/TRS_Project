'use client'
import { useState } from "react";
import AjoutButton from "../adminLayout/AjoutButton";
import AjoutUserForm from "./AjoutUserForm";

export default function AddUserAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AjoutButton setIsOpen={setIsOpen} title="Ajouter un utilisateur" />
      <AjoutUserForm 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}