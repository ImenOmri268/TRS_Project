'use client'
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdPersonOutline, MdMailOutline, MdToggleOn, MdToggleOff, MdErrorOutline } from "react-icons/md";
import { HiPlus, HiSave } from "react-icons/hi";  
import { IoReturnUpBack } from "react-icons/io5";

const AjoutUserForm = ({ isOpen, onClose, refresh, userToEdit = null }) => {
  const [loading, setLoading] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [error, setError] = useState("");
  const errorTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userRole : "",
    status: true,
    permissionIds: [] 
  });

  // 1. Fetch available permissions
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
      setError(""); // Clear error on open
      if (userToEdit) {
        setFormData({
          name: userToEdit.name || "",
          email: userToEdit.email || "",
          userRole: userToEdit.userRole || "",
          status: userToEdit.status === 'Actif' || userToEdit.status === true,
          permissionIds: userToEdit.permissionIds || []
        });
      } else {
        setFormData({ name: "", email: "", userRole: "", status: true, permissionIds: [] });
      }
    }
  }, [isOpen, userToEdit]);

  const handlePermissionToggle = (id) => {
    if (error) setError("");
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id)
        ? prev.permissionIds.filter(pId => pId !== id)
        : [...prev.permissionIds, id]
    }));
  };

  const handleSubmit = async () => {
    // Clear existing timer
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.userRole.trim()) {
      setError("Champs obligatoires manquants. Veuillez vérifier les informations de l'utilisateur.");
      
      // Auto-scroll to top to see error
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Hide after 4 seconds
      errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
      return;
    }

    setLoading(true);
    try {
      const isEditing = !!userToEdit;
      const url = '/api/admin/utilisateurs';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        name: formData.name,
        email: formData.email,
        userRole: formData.userRole,
        status: formData.status,
        permissionIds: formData.permissionIds,
      };

      if (isEditing) payload.id = userToEdit.id;

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
        setError(errorData.message || "Une erreur est survenue");
        errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
      }
    } catch (err) {
      setError("Erreur réseau ou connexion au serveur.");
      errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* STICKY HEADER */}
            <div className="bg-white px-8 pt-6 pb-3 flex items-center justify-between border-b border-slate-100 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {userToEdit ? `Modifier ${userToEdit.name}` : "Ajouter un utilisateur"}
                </h2>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">* Champs obligatoires</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <MdClose className="text-2xl text-slate-400" />
              </button>
            </div>

            {/* ERROR MESSAGE BAR */}
            <AnimatePresence>
              {error && (
                <motion.div 
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  className="bg-red-50 border-b border-red-100 w-full"
                                >
                  <div className="px-8 py-3 flex items-center gap-3 text-red-600 text-sm font-semibold">
                    <MdErrorOutline className="text-xl shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SCROLLABLE CONTENT */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
            >
              {/* Profile Info */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informations *</h3>
                <div className="grid gap-4">
                  <ModalInput 
                    icon={MdPersonOutline} label="Nom complet" 
                    value={formData.name}
                    onChange={(e) => { setError(""); setFormData({...formData, name: e.target.value}) }}
                  />
                  <ModalInput 
                    icon={MdMailOutline} label="Email Professionnel" 
                    value={formData.email}
                    onChange={(e) => { setError(""); setFormData({...formData, email: e.target.value}) }}
                  />
                  <ModalInput 
                    icon={MdPersonOutline} label="Rôle / Titre" 
                    value={formData.userRole}
                    onChange={(e) => { setError(""); setFormData({...formData, userRole: e.target.value}) }}
                  />
                  
                  {userToEdit && (
                    <div 
                      onClick={() => setFormData({...formData, status: !formData.status})}
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
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
              </section>

              {/* Permissions Grid */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Droits d&apos;accès</h3>
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
              </section>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={onClose} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                <IoReturnUpBack size={20} /> Annuler
              </button>
              <button 
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? "Enregistrement..." : userToEdit ? <><HiSave size={20}/> Enregistrer</> : <><HiPlus size={20}/> Créer</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}  
    </AnimatePresence>
  );
};

const ModalInput = ({ icon: Icon, label, value, onChange }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
    <Icon className="text-2xl text-slate-400" />
    <div className="flex-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300" 
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default AjoutUserForm;