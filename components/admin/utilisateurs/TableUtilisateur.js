'use client';
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import ModifUtilisateur from "./ModifUtilisateur";
import { FaArrowRightLong } from "react-icons/fa6";
import DetailsUtilisateur from "./DetailsUtilisateur";

const TableUtilisateur = ({ utilisateurs }) => {
  const [selectedUser, setSelectedUser] = useState(null); 
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [users, setUsers] = useState(utilisateurs);

   const handleDelete = (id) => {
      const user = users.find(u => u.id === id);
      if(window.confirm(`Voulez-vous vraiment supprimer ${user.name} ?`)) {
        setUsers(users.filter(user => user.id !== id));
      }
    };



  return (
    <div className="w-full bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center p-6 gap-4 border-b border-slate-100 bg-slate-50/30">
        <span className="text-slate-800 font-black text-xl tracking-tight">Répertoire Équipe</span>
        
        <div className="relative w-full md:w-80">
          <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input 
            type="text" 
            placeholder="Rechercher un membre..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
              <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
              <th className="py-4 px-6 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Statut</th>
              <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="py-4 px-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((utilisateur) => (
              <tr className="hover:bg-slate-50/80 transition-colors group" key={utilisateur.id}>
                <td className="py-5 px-6 text-sm font-bold text-slate-400">#{utilisateur.id.toString().padStart(3, '0')}</td>
                <td className="py-5 px-6">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{utilisateur.name}</p>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${utilisateur.status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {utilisateur.status}
                  </span>
                </td>
                <td className="py-5 px-6 text-sm font-medium text-slate-500">{utilisateur.email}</td>
                <td className="py-5 px-6 text-right space-x-2">
                  <button onClick={() => setSelectedUser(utilisateur)} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    <FaRegEdit size={18} />
                  </button>
                  <button onClick={() => handleDelete(utilisateur.id)} className=" text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                    <FaRegTrashAlt size={18} />
                  </button>
                </td>
                <td className="py-5 px-6 text-right">
                    <button 
                      onClick={() => setSelectedUserDetails(utilisateur)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-black text-[11px] uppercase tracking-tighter transition-all"
                    >
                      Détails <FaArrowRightLong />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModifUtilisateur userData={selectedUser} setSelectedUser={() => setSelectedUser(null)} />
      <DetailsUtilisateur userData={selectedUserDetails} setSelectedUserDetails={() => setSelectedUserDetails(null)} />
    </div>
  );
};

export default TableUtilisateur;