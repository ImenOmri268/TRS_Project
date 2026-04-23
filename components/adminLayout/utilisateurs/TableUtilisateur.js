import Image from "next/image";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";

const TableUtilisateur = () => {
  return (
    <div className="relative bg-[#DADADA] w-full">
        <div className="flex justify-between space-x-2 ">
            <span className="text-[#818181] font-medium text-lg px-3">Liste des utilisateurs</span>
            <CiSearch className="text-white "  />
        </div>
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-t-2 border-b-2 border-black">
                <th className="py-4 text-left px-4 text-2xl font-semibold">ID</th>
                <th className="py-4 text-left px-4 text-2xl font-semibold">Nom et prénom</th>
                <th className="py-4 text-center px-4 text-2xl font-semibold">Status</th>
                <th className="py-4 text-left px-4 text-2xl font-semibold">Email</th>
                <th className="py-4"></th>
              </tr>
            </thead>
            <tbody>

            </tbody>
        
          </table>
        </div>
    </div>
  )
};

export default TableUtilisateur;
