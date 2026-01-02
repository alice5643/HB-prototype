import React, { useState } from 'react';
import { ConsoleLayout } from '@/components/ConsoleLayout';
import { Plus, Search, Edit2, Trash2, LayoutGrid, Users, Move, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore, Table } from '@/lib/store';

export default function ConsoleVenue() {
  const { tables, updateTableStatus, resetTables } = useStore();
  const [selectedZone, setSelectedZone] = useState('Main Dining');
  const [isEditMode, setIsEditMode] = useState(false);

  const zones = ['Main Dining', 'Bar Area', 'Terrace', 'Private Room'];

  // Filter tables based on ID convention (T for Main, B for Bar)
  const mainTables = tables.filter(t => t.id.startsWith('T') || (!t.id.startsWith('B') && !isNaN(Number(t.id))));
  const barTables = tables.filter(t => t.id.toLowerCase().startsWith('b'));

  const currentTables = selectedZone === 'Main Dining' ? mainTables : 
                       selectedZone === 'Bar Area' ? barTables : [];

  return (
    <ConsoleLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif text-[#2C1810]">Venue Setup</h1>
            <p className="text-[#8B4513]/70 mt-1">Configure floor plans, zones, and table arrangements</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => resetTables()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E0D6] rounded-lg text-[#8B4513] hover:bg-[#F5F2EA] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Layout</span>
            </button>
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                isEditMode 
                  ? "bg-[#2C1810] text-[#F5F2EA]" 
                  : "bg-[#8B4513] text-white hover:bg-[#723A0F]"
              )}
            >
              {isEditMode ? (
                <>
                  <LayoutGrid className="w-4 h-4" />
                  <span>Save Layout</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Layout</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Zone Navigation */}
        <div className="flex gap-1 mb-8 bg-white p-1 rounded-lg border border-[#E5E0D6] w-fit">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                selectedZone === zone
                  ? "bg-[#F5F2EA] text-[#2C1810] shadow-sm"
                  : "text-[#8B4513]/60 hover:text-[#8B4513] hover:bg-gray-50"
              )}
            >
              {zone}
            </button>
          ))}
          <button className="px-4 py-2 rounded-md text-sm font-medium text-[#8B4513]/60 hover:text-[#8B4513] hover:bg-gray-50 flex items-center gap-2">
            <Plus className="w-3 h-3" />
            Add Zone
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Floor Plan Visualizer */}
          <div className="lg:col-span-2 bg-[#F5F2EA] rounded-xl border border-[#E5E0D6] p-8 min-h-[600px] relative overflow-hidden">
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md border border-[#E5E0D6] text-xs font-medium text-[#8B4513]">
              {selectedZone} Floor Plan
            </div>
            
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(#2C1810 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
            />

            {/* Tables */}
            <div className="relative w-full h-full">
              {currentTables.map((table) => (
                <div
                  key={table.id}
                  className={cn(
                    "absolute flex flex-col items-center justify-center transition-all cursor-pointer",
                    "bg-white border-2 shadow-sm hover:shadow-md",
                    table.status === 'occupied' ? "border-red-200 bg-red-50" :
                    table.status === 'reserved' ? "border-amber-200 bg-amber-50" :
                    "border-[#E5E0D6]"
                  )}
                  style={{
                    left: `${table.x / 2}px`, // Scale down for view
                    top: `${table.y / 2}px`,
                    width: table.seats <= 2 ? '60px' : table.seats <= 4 ? '80px' : '100px',
                    height: table.seats <= 2 ? '60px' : table.seats <= 4 ? '80px' : '100px',
                    borderRadius: table.seats > 4 ? '8px' : '50%'
                  }}
                >
                  <span className="font-serif font-bold text-[#2C1810]">{table.name}</span>
                  <div className="flex items-center gap-0.5 text-[10px] text-[#8B4513]/60 mt-0.5">
                    <Users className="w-3 h-3" />
                    <span>{table.seats}</span>
                  </div>
                  
                  {isEditMode && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#2C1810] rounded-full flex items-center justify-center text-white shadow-sm">
                      <Move className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
              
              {currentTables.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[#8B4513]/40">
                  <p>No tables configured for this zone</p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E0D6] p-6">
              <h3 className="font-serif text-lg text-[#2C1810] mb-4">Zone Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#8B4513]/70 uppercase tracking-wider mb-1.5">
                    Zone Name
                  </label>
                  <input 
                    type="text" 
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#E5E0D6] rounded-lg text-[#2C1810] focus:outline-none focus:border-[#8B4513]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8B4513]/70 uppercase tracking-wider mb-1.5">
                    Capacity
                  </label>
                  <div className="flex items-center gap-4 text-[#2C1810]">
                    <div className="flex-1 px-3 py-2 bg-[#F9F8F6] border border-[#E5E0D6] rounded-lg">
                      <span className="text-sm font-medium">{currentTables.reduce((acc, t) => acc + t.seats, 0)} Seats</span>
                    </div>
                    <div className="flex-1 px-3 py-2 bg-[#F9F8F6] border border-[#E5E0D6] rounded-lg">
                      <span className="text-sm font-medium">{currentTables.length} Tables</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E0D6] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-[#2C1810]">Table List</h3>
                <button className="p-1.5 hover:bg-[#F5F2EA] rounded-md text-[#8B4513] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {currentTables.map((table) => (
                  <div key={table.id} className="flex items-center justify-between p-3 bg-[#F9F8F6] rounded-lg border border-transparent hover:border-[#E5E0D6] group transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E5E0D6] flex items-center justify-center font-serif font-bold text-[#2C1810] text-xs">
                        {table.name}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#2C1810]">Standard Table</div>
                        <div className="text-xs text-[#8B4513]/60">{table.seats} Seats</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white rounded-md text-[#8B4513]">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 hover:bg-white rounded-md text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
}
