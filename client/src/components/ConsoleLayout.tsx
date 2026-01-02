import React from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, UtensilsCrossed, Store, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsoleLayoutProps {
  children: React.ReactNode;
}

export function ConsoleLayout({ children }: ConsoleLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/console' },
    { icon: UtensilsCrossed, label: 'Menu Management', href: '/console/menu' },
    { icon: Store, label: 'Venue Setup', href: '/console/venue' },
    { icon: Users, label: 'Staff Management', href: '/console/staff' },
    { icon: BarChart3, label: 'Analytics', href: '/console/analytics' },
    { icon: Settings, label: 'Account', href: '/console/account' },
  ];

  return (
    <div className="flex h-screen bg-[#FDFBF7]">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#E5E0D6] bg-[#FDFBF7] flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-serif font-bold text-[#5C4033]">Harbour Beat</h1>
          <p className="text-xs text-[#8B4513] uppercase tracking-wider mt-1">Restaurant Manager</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#F5F2EA] text-[#5C4033]" 
                    : "text-[#8B4513]/70 hover:bg-[#F5F2EA]/50 hover:text-[#5C4033]"
                )}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E0D6]">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-[#8B4513]/70 hover:text-[#5C4033] transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
