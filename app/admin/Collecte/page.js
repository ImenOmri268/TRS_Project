'use client'
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import { MdSettingsInputComponent } from "react-icons/md";
import ResourceSidebar from "@/components/admin/collecte/ResourceSidebar ";
import CollectForm from "@/components/admin/collecte/CollectForm";

const CollectePage = () => {
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetching resources with the new parameter structures
  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ressources'); 
      if (res.ok) {
        const data = await res.json();
        setResources(data);
        
        // Auto-select the first active resource if none is selected
        if (data.length > 0 && !selectedResourceId) {
          const firstActive = data.find(r => r.statut) || data[0];
          setSelectedResourceId(firstActive.id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch resources", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Find the selected resource object to pass down to the form
  const selectedResource = resources.find(r => r.id === selectedResourceId);

  return (
    <AdminLayout activePage="Collecte des données">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <MdSettingsInputComponent className="text-blue-600" />
              </div>
              Collecte des Données
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Saisie manuelle des indicateurs de production par ressource.
            </p>
          </div>
          
          {/* Optional: Last Sync Indicator or Refresh Button */}
          <button 
            onClick={fetchResources}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            Actualiser les ressources
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-c ols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* Left Side: Resource Picker */}
          <div className="lg:col-span-4">
            <ResourceSidebar 
              resources={resources} 
              selectedId={selectedResourceId} 
              onSelect={setSelectedResourceId}
              loading={loading}
            />
          </div>

          {/* Right Side: Dynamic Form */}
          <div className="lg:col-span-8">
            <CollectForm 
              resource={selectedResource} 
              onSuccess={fetchResources} // Optional: Refresh data after save
            />
          </div>
          
        </div>
      </div>
    </AdminLayout>
  );
};

export default CollectePage;