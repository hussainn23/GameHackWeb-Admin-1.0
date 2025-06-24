"use client"

import * as React from "react"
import {
 
  Delete,
  LayoutDashboardIcon,
  Pen,

} from "lucide-react"
	import { Archive } from "lucide-react"
import { NavMain } from "./Navmain.jsx"

import { FileUp } from "lucide-react"
import { ListOrdered } from "lucide-react"
import {
  Sidebar,
  SidebarContent,

  SidebarHeader,

} from "../ui/sidebar.jsx"
import { FaTelegram, FaTelegramPlane } from "react-icons/fa"

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png",
  },
 
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
      isActive: true,
     
    },
    {
      title: "All APP",
      url: "/allApks",
      icon:Archive,
   
    },
    {
      title: "Upload APP",
      url: "/addApk",
      icon: FileUp,
      
    },
    {
      title:"Delete APP",
      url:"/deleteApk",
      icon:Delete
    },
     {
      title:"Edit APP",
      url:"/editApks",
      icon:Pen
    },
     {
      title:"Telegram ",
      url:"/telegram",
      icon:FaTelegramPlane
    }
  
  ],

}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon"  className="w-[20%] fixed text-white" >
      <SidebarHeader className="mt-2 ">
     
 
      </SidebarHeader>
      <SidebarContent className="mt-3 ">
      <NavMain items={data.navMain} />  
      </SidebarContent>
    </Sidebar>
  )
}
