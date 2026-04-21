'use client'
import { useState } from 'react'
import ResponsiveMenu from './ResponsiveMenu'
import MenuButton from './MenuButton'
import NotifButton from '../NotifButton'
import NotifBar from '../NotifBar'
import Title from './Title'


export default function AdminLayout({ activePage , children}) {
  const [open, setOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)

  return (
    <div className="flex h-screen bg-[#F1F0F0] overflow-hidden  ">
      
       
      <ResponsiveMenu open={open} page={activePage} />
        
        
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out  ${open ? 'ml-0' : 'ml-[20%]'}`}>
          
          
          <div className="relative h-16 flex items-center justify-center">
            <MenuButton open={open} setOpen={setOpen} />
            <NotifButton showNotif={showNotif} setShowNotif={setShowNotif} />
            <Title  title={activePage} />
          </div>
          <hr className='mt-2  ml-[20%] mr-[20%] ' />
          
          
          <main className="flex-1 overflow-y-auto  px-6 ">
            {children}
          </main>
        
      </div>
      

      <NotifBar showNotif={showNotif} setShowNotif={setShowNotif} />
      
    </div>
  )
}