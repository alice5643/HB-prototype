import React, { useState } from 'react';
import { ConsoleLayout } from '@/components/ConsoleLayout';
import { Plus, Search, MoreHorizontal, Mail, Phone, Shield, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StaffMember {
  id: string;
  name: string;
  role: 'Manager' | 'Server' | 'Sommelier' | 'Host' | 'Chef';
  status: 'Active' | 'On Break' | 'Off Duty';
  email: string;
  phone: string;
  schedule: string;
  avatar?: string;
}

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Manager',
    status: 'Active',
    email: 'sarah.j@savoy.com',
    phone: '+44 7700 900077',
    schedule: '09:00 - 18:00'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Sommelier',
    status: 'Active',
    email: 'm.chen@savoy.com',
    phone: '+44 7700 900123',
    schedule: '16:00 - 23:00'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    role: 'Server',
    status: 'On Break',
    email: 'emma.w@savoy.com',
    phone: '+44 7700 900456',
    schedule: '15:00 - 23:00'
  },
  {
    id: '4',
    name: 'James Rodriguez',
    role: 'Server',
    status: 'Active',
    email: 'j.rodriguez@savoy.com',
    phone: '+44 7700 900789',
    schedule: '15:00 - 23:00'
  },
  {
    id: '5',
    name: 'Olivia Thompson',
    role: 'Host',
    status: 'Off Duty',
    email: 'olivia.t@savoy.com',
    phone: '+44 7700 900234',
    schedule: 'Off'
  }
];

export default function ConsoleStaff() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);

  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? staff.role === filterRole : true;
    return matchesSearch && matchesRole;
  });

  const roles = Array.from(new Set(mockStaff.map(s => s.role)));

  return (
    <ConsoleLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif text-[#2C1810]">Staff Management</h1>
            <p className="text-[#8B4513]/70 mt-1">Manage team members, roles, and schedules</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2C1810] text-[#F5F2EA] rounded-lg hover:bg-[#4A2C20] transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B4513]/40" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E0D6] rounded-lg text-[#2C1810] placeholder:text-[#8B4513]/40 focus:outline-none focus:border-[#8B4513]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setFilterRole(null)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                !filterRole 
                  ? "bg-[#2C1810] text-[#F5F2EA]" 
                  : "bg-white border border-[#E5E0D6] text-[#8B4513] hover:bg-[#F5F2EA]"
              )}
            >
              All Roles
            </button>
            {roles.map(role => (
              <button 
                key={role}
                onClick={() => setFilterRole(role)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  filterRole === role
                    ? "bg-[#2C1810] text-[#F5F2EA]" 
                    : "bg-white border border-[#E5E0D6] text-[#8B4513] hover:bg-[#F5F2EA]"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="bg-white rounded-xl border border-[#E5E0D6] p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F2EA] border border-[#E5E0D6] flex items-center justify-center text-lg font-serif font-bold text-[#2C1810]">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#2C1810]">{staff.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-medium text-[#8B4513]/70 bg-[#F5F2EA] px-2 py-0.5 rounded">
                        {staff.role}
                      </span>
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        staff.status === 'Active' ? "bg-green-500" :
                        staff.status === 'On Break' ? "bg-amber-500" :
                        "bg-gray-300"
                      )} />
                    </div>
                  </div>
                </div>
                <button className="text-[#8B4513]/40 hover:text-[#2C1810] transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E5E0D6]/50">
                <div className="flex items-center gap-3 text-sm text-[#8B4513]/80">
                  <Mail className="w-4 h-4 text-[#8B4513]/40" />
                  <span>{staff.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#8B4513]/80">
                  <Phone className="w-4 h-4 text-[#8B4513]/40" />
                  <span>{staff.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#8B4513]/80">
                  <Clock className="w-4 h-4 text-[#8B4513]/40" />
                  <span>{staff.schedule}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 py-2 text-xs font-medium border border-[#E5E0D6] rounded-lg text-[#2C1810] hover:bg-[#F5F2EA] transition-colors">
                  View Profile
                </button>
                <button className="flex-1 py-2 text-xs font-medium border border-[#E5E0D6] rounded-lg text-[#2C1810] hover:bg-[#F5F2EA] transition-colors">
                  Edit Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ConsoleLayout>
  );
}
