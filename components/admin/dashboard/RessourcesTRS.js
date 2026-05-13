'use client'
import { useEffect, useState } from 'react'

const ProgressBar = ({ label, valeur, couleur }) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-semibold ${couleur}`}>{valeur ?? '—'}%</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        /* This ensures bg-purple-600 is included */
        /* bg-purple-600 bg-blue-500 bg-green-500 */
        className={`h-2 rounded-full transition-all duration-500 ${couleur.replace('text', 'bg')}`}
        style={{ width: `${valeur ?? 0}%` }}
      />
    </div>
  </div>
)

const RessourcesTRS = () => {
  const [ressources, setRessources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setRessources(data.machines || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-48 border border-slate-100" />
      ))}
    </div>
  )

  if (ressources.length === 0) return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Performances TRS par machine</h2>
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
        Aucune machine trouvée
      </div>
    </div>
  )

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">
        Performances TRS par machine
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ressources.map(ressource => (
          <div key={ressource.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-slate-800 text-lg">{ressource.nom}</h3>
              <span className="text-xs text-slate-400">{ressource.type}</span>
            </div>
            <ProgressBar label="Disponibilité" valeur={ressource.disponibilite} couleur="text-blue-500" />
            <ProgressBar label="Performance"   valeur={ressource.performance}   couleur="text-green-500" />
            <ProgressBar label="Qualité"        valeur={ressource.qualite}        couleur="text-purple-600" />
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500">TRS</span>
              <span className="text-2xl font-bold text-slate-800">
                {ressource.trsInitial ?? '—'}%
              </span>
            </div>
            {ressource.objectif && (
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-slate-400">Objectif</span>
                <span className="text-sm font-semibold text-orange-500">{ressource.objectif}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RessourcesTRS;