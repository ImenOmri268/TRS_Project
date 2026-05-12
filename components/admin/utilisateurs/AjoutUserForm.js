'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdPersonOutline, MdMailOutline, MdToggleOn, MdToggleOff } from "react-icons/md";
import { HiPlus, HiSave } from "react-icons/hi";  
import { IoReturnUpBack } from "react-icons/io5";
import { PERMISSIONS_CONFIG } from "@/app/lib/permissions-config";


const AjoutUserForm = ({ isOpen, onClose, refresh, userToEdit = null  }) => {
  const [loading, setLoading] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userRole : "",
    status: true,
    permissionIds: [] 
  });

  // 1. Fetch available permissions for checkboxes
  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/permissions')
        .then(res => res.json())
        .then(data => setAvailablePermissions(data))
        .catch(err => console.error("Error fetching permissions:", err));
    }
  }, [isOpen]);

  // 2. Handle PRE-FILLING when editing
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setFormData({
          name: userToEdit.name || "",
          email: userToEdit.email || "",
          userRole:userToEdit.userRole || "",
          status: userToEdit.status === 'Actif' || userToEdit.status === true,
          permissionIds: userToEdit.permissionIds || []
        });
      } else {
        // Reset form for new user
        setFormData({ name: "", email: "",userRole:"", status: true, permissionIds: [] });
      }
    }
  }, [isOpen, userToEdit]);

  const handlePermissionToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id)
        ? prev.permissionIds.filter(pId => pId !== id)
        : [...prev.permissionIds, id]
    }));
  };



  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.userRole) return alert("Champs obligatoires manquants");

    setLoading(true);
    try {
      // Logic to switch between Edit (PUT) and Create (POST)
      const isEditing = !!userToEdit;
      const url = '/api/admin/utilisateurs';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        name: formData.name,
        email: formData.email,
        userRole:formData.userRole,
        status: formData.status,
        permissionIds: formData.permissionIds,
      };

      // CRITICAL: If editing, we MUST include the ID so Prisma knows WHO to update
      if (isEditing) {
        payload.id = userToEdit.id;
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onClose();
        refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erreur");
      }
    } catch (err) {
      alert("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}  
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
               onClick={(e) => e.stopPropagation()}>
            
            <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-10">
              <h2 className="text-xl font-bold">
                {userToEdit ? `modifier ${userToEdit.name}`  : "Ajouter un utilisateur"}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <MdClose className="text-2xl text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Profile Info */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Informations</h3>
                <div className="grid gap-4">
                  <ModalInput 
                    icon={MdPersonOutline} label="Nom complet" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <ModalInput 
                    icon={MdMailOutline} label="Email Professionnel" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <ModalInput 
                    icon={MdMailOutline} label="Donner son role" 
                    value={formData.userRole}
                    onChange={(e) => setFormData({...formData, userRole: e.target.value})}
                  />

                  
                  {userToEdit && (
                    <div 
                      onClick={() => setFormData({...formData, status: !formData.status})}
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        {formData.status ? <MdToggleOn className="text-3xl text-green-500" /> : <MdToggleOff className="text-3xl text-slate-400" />}
                        <span className="font-bold text-slate-700 text-sm uppercase">Statut du compte</span>
                      </div>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${formData.status ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                        {formData.status ? 'ACTIF' : 'INACTIF'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions Grid */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Droits d&apos;accès</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availablePermissions.map((perm) => (
                    <label 
                      key={perm.id} 
                      className={`flex items-center gap-3 cursor-pointer group p-3 rounded-xl border-2 transition-all ${
                        formData.permissionIds.includes(perm.id) 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-blue-600 border-slate-300 rounded"
                        checked={formData.permissionIds.includes(perm.id)}
                        onChange={() => handlePermissionToggle(perm.id)}
                      />
                      <span className="text-sm font-medium text-slate-700">{perm.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={onClose} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                <IoReturnUpBack /> Annuler
              </button>
              <button 
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
              >
                {loading ? "Enregistrement..." : userToEdit ? <><HiSave /> Enregistrer</> : <><HiPlus /> Créer</>}
              </button>
            </div>
          </div>
        </motion.div>
      )}  
    </AnimatePresence>
  );
};

const ModalInput = ({ icon: Icon, label, value, onChange }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus-within:border-blue-500 focus-within:bg-white transition-all">
    <Icon className="text-2xl text-slate-400" />
    <div className="flex-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        className="w-full bg-transparent text-slate-900 font-medium focus:outline-none" 
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default AjoutUserForm;