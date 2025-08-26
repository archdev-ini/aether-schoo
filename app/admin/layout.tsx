
import Link from "next/link";
import {
  Bell,
  BookCopy,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  Users,
  Calendar,
} from "lucide-react"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // In a real app, this layout would be protected by authentication.
  // For now, we assume the user is an admin.

  const navItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/members", icon: Users, label: "Members" },
    { href: "/admin/content", icon: BookCopy, label: "Content" },
    { href: "/admin/manage-events", icon: Calendar, label: "Events" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="">Aether Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* Mobile Header can be added here if needed */}
        {children}
      </div>
    </div>
  )
}
