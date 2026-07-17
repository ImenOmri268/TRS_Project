'use client'
import { useState } from "react";
import AjoutButton from "../adminLayout/AjoutButton";
import AjoutUserForm from "./AjoutUserForm";

export default function AddUserAction({ refresh }) {
  const [isOpen, setIsOpen] = useState(false);

  // We handle the close logic here to ensure the state is fully cleared
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* The button that triggers the modal */}
      <AjoutButton setIsOpen={setIsOpen} title="Ajouter un utilisateur" />
      
      {/* The Modal Form */}
      <AjoutUserForm 
        isOpen={isOpen} 
        onClose={handleClose}
        refresh={refresh}
        // userToAdd is null here because this action is specifically for CREATING
        userToEdit={null} 
      />
    </>
  );
}