'use client'
import React, { useState, useEffect } from "react";
import UserLayout from "@/components/user/userLayout/UserLayout";
import { MdSettingsInputComponent } from "react-icons/md";
import UserResourceSidebar from "@/components/user/collect/UserResourceSidebar";
import UserCollectForm from "@/components/user/collect/UserCollectForm";


const CollectePage = () => {
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/ressources');
      if (res.ok) {
        const data = await res.json();
        setResources(data);
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

  useEffect(() => { fetchResources(); }, []);

  const selectedResource = resources.find(r => r.id === selectedResourceId);

  return (
    <UserLayout activePage="Collecte TRS">
      <div className="space-y-8 animate-in fade-in duration-700">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          <div className="lg:col-span-4">
            <UserResourceSidebar
              resources={resources}
              selectedId={selectedResourceId}
              onSelect={setSelectedResourceId}
              loading={loading}
            />
          </div>
          <div className="lg:col-span-8">
            <UserCollectForm
              resource={selectedResource}
              onSuccess={fetchResources}
              apiUrl="/api/user/ressources"
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CollectePage;