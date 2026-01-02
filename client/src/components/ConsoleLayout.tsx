import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, UtensilsCrossed, Store, Users, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsoleLayoutProps {
  children: React.ReactNode;
}

export function ConsoleLayout({ children }: ConsoleLayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/console' },
    { icon: UtensilsCrossed, label: 'Menu Management', href: '/console/menu' },
    { icon: Store, label: 'Venue Setup', href: '/console/venue' },
    { icon: Users, label: 'Staff Management', href: '/console/staff' },
    { icon: BarChart3, label: 'Analytics', href: '/console/analytics' },
    { icon: Settings, label: 'Account', href: '/console/account' },
  ];

  return (
    <div className="flex h-screen bg-[#FDFBF7] overflow-hidden console-layout-wrapper">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#FDFBF7] border-b border-[#E5E0D6] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-serif font-bold text-[#5C4033]">Harbour Beat</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#8B4513] hover:bg-[#F5F2EA] rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-[#E5E0D6] bg-[#FDFBF7] flex flex-col transition-transform duration-300 ease-in-out lg:transform-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden lg:block">
          <h1 className="text-xl font-serif font-bold text-[#5C4033]">Harbour Beat</h1>
          <p className="text-xs text-[#8B4513] uppercase tracking-wider mt-1">Restaurant Manager</p>
        </div>

        <div className="p-6 lg:hidden mt-16">
          <p className="text-xs text-[#8B4513] uppercase tracking-wider">Restaurant Manager</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#F5F2EA] text-[#5C4033]" 
                  : "text-[#8B4513]/70 hover:bg-[#F5F2EA]/50 hover:text-[#5C4033]"
              )} onClick={() => setIsMobileMenuOpen(false)}>
                <item.icon className="w-5 h-5" />
                {item.label}
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
      <div className="flex-1 overflow-auto pt-16 lg:pt-0 w-full">
        {children}
      </div>
    </div>
  );
}
