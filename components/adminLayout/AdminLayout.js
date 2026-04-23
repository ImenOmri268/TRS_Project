'use client'
import { useState } from 'react'
import ResponsiveMenu from './ResponsiveMenu'
import MenuButton from './MenuButton'
import NotifButton from '../NotifButton'
import NotifBar from '../NotifBar'
import Title from './Title'


export default function AdminLayout({ activePage, children}) {
  const [open, setOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F1F0F0] overflow-hidden  ">
      
       
      <ResponsiveMenu open={open} page={activePage} />
        
        
      <div className={`flex-1 flex flex-col  duration-300   ${open ?  'ml-0' : ':ml-7 '}`}>
          
          
          <div className="relative h-16 flex items-center justify-center">
            <MenuButton open={open} setOpen={setOpen} />
            <div className="absolute right-[5%] lg:right-[1%] flex items-center">
              <NotifButton showNotif={showNotif} setShowNotif={setShowNotif} />
              <NotifBar showNotif={showNotif} setShowNotif={setShowNotif} />
            </div>
            <Title  title={activePage} />
          </div>
          <hr className='mt-2  ml-[20%] mr-[20%] ' />
          
          
          <main className=" px-6 left-[20%]    ">
            {children}
          </main>
        
      </div>
      

      
      
    </div>
  )
}