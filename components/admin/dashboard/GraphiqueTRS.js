'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const GraphiqueTRS = () => {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setMachines(data.machines || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const chartData = machines.map(m => ({
    nom: m.nom,
    'TRS Initial': m.trsInitial ?? 0,
    'TRS Final': m.trsFinal ?? 0,
    'Objectif': m.objectif ?? 0,
  }))

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse h-80" />
  )

  if (machines.length === 0) return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 mb-8">
      Aucune donnée pour le graphique
    </div>
  )

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-slate-700 mb-6">
        TRS Initial vs Final par ressource
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="TRS Initial" fill="#EF4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="TRS Final"   fill="#22C55E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Objectif"    fill="#F97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraphiqueTRS