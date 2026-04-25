'use client'
import { useState } from "react";
import AjoutButton from "./AjoutButton";
import AjoutUserForm from "./AjoutUserForm";

export default function AddUserAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AjoutButton isOpen={isOpen} setIsOpen={setIsOpen} />
      <AjoutUserForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}