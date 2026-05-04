'use client'
import { useState } from 'react'
import ResponsiveMenu from './ResponsiveMenu'
import MenuButton from './MenuButton'
import NotifButton from '../../notification/NotifButton'
import NotifBar from '../../notification/NotifBar'

export default function AdminLayout({ activePage, children }) {
  const [open, setOpen] = useState(false) 
  const [showNotif, setShowNotif] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-black ">
      
      <ResponsiveMenu open={open} page={activePage} />
      

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-4 md:px-8 bg-white border-b border-slate-200  top-0 z-30">
          <div className="flex items-center gap-4 w-full">
            <div >
              <MenuButton open={open} setOpen={setOpen} />
            </div>
            
            <div className='flex-1 flex items-center justify-end gap-4'>
              <NotifButton showNotif={showNotif} setShowNotif={setShowNotif} />
              <NotifBar showNotif={showNotif} setShowNotif={setShowNotif} />
            </div>
            
            

            
            
            
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full ">
          {children}
        </main>
      </div>
    </div>
  )
}