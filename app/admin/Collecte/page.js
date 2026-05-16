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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/admin/ressources'); // Reuse your existing resource list API
        if (res.ok) {
          const data = await res.json();
          setResources(data);
        }
      } catch (err) {
        console.error("Failed to fetch resources", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const selectedResource = resources.find(r => r.id === selectedResourceId);

  return (
    <AdminLayout activePage="Collecte des données">
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MdSettingsInputComponent className="text-blue-600" /> Collecte des Données
          </h2>
          <p className="text-sm text-slate-500 mt-1">Sélectionnez une ressource pour saisir les données brutes de production.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <ResourceSidebar 
              resources={resources} 
              selectedId={selectedResourceId} 
              onSelect={setSelectedResourceId}
              loading={loading}
            />
          </div>
          <div className="lg:col-span-8">
            <CollectForm resource={selectedResource} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CollectePage;