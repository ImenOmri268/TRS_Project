'use client'
import { useEffect, useState } from 'react'
import { GoAlertFill } from 'react-icons/go'
import { HiUsers } from 'react-icons/hi'
import { IoSettingsOutline, IoStatsChartSharp } from 'react-icons/io5'

const StatsTRS = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-32 border border-slate-100" />
      ))}
    </div>
  )

  const cards = [
    {
      titre: 'TRS Moyen',
      valeur: `${stats?.trsMoyen ?? 0}%`,
      couleur: 'text-blue-600',
      bg: 'bg-blue-50',
      bordure: 'border-blue-100',
      icone:<IoStatsChartSharp className="text-blue-600" />
    },
    {
      titre: 'Machines',
      valeur: stats?.nbMachines ?? 0,
      couleur: 'text-green-600',
      bg: 'bg-green-50',
      bordure: 'border-green-100',
      icone: <IoSettingsOutline className="text-green-600" />
    },
    {
      titre: 'Utilisateurs',
      valeur: stats?.nbUsers ?? 0,
      couleur: 'text-purple-600',
      bg: 'bg-purple-50',
      bordure: 'border-purple-100',
      icone: <HiUsers className="text-purple-600" />
    },
    {
      titre: 'Actions en retard',
      valeur: stats?.actionsEnRetard ?? 0,
      couleur: 'text-red-600',
      bg: 'bg-red-50',
      bordure: 'border-red-100',
      icone: <GoAlertFill className="text-red-600" />
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <div key={i} className={`${card.bg} border ${card.bordure} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500 font-medium">{card.titre}</span>
            <span className="text-2xl">{card.icone}</span>
          </div>
          <div className={`text-3xl font-bold ${card.couleur}`}>
            {card.valeur}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsTRS