import React from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export function NavMain({ items }) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white lg:text-2xl sm:text-[12px] md:text-[14px] mb-3 flex items-center gap-2">
        <FaUser className="lg:text-3xl " />
        Admin Panel
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          const hasSubItems = item.items && item.items.length > 0;

          return hasSubItems ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.items.some((sub) => location.pathname === sub.url)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                      item.items.some((sub) => location.pathname === sub.url)
                        ? "bg-muted text-primary"
                        : ""
                    }`}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={`${item.title}-${subItem.title}`}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={subItem.url}
                            className={`block px-3 py-2 rounded-md transition ${
                              location.pathname === subItem.url
                                ? "bg-muted text-primary"
                                : ""
                            }`}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive ? "bg-muted text-primary" : ""
                }`}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
