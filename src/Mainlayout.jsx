import React from 'react'
import { AppSidebar } from './components/sidebar/AppSidebar'
import { SidebarInset } from './components/ui/sidebar'
import Navbar from './components/navbar/Navbar'
import App from './App'

const Mainlayout = () => {
  return (
    <div className=" flex justify-between min-h-screen w-full">
        <AppSidebar />

       <SidebarInset>
        <main>
            <Navbar/>
            <App />
         
        </main>
       </SidebarInset>
    </div>
  )
}

export default Mainlayout