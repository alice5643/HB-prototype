import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { 
  Plus, 
  Save, 
  RotateCcw, 
  Move, 
  Trash2, 
  Grid, 
  ZoomIn, 
  ZoomOut,
  LayoutTemplate,
  Armchair,
  Sofa,
  Users,
  Layers
} from 'lucide-react';
import { ConsoleLayout } from '@/components/ConsoleLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ConsoleVenue() {
  const { tables, updateTableStatus, resetTables } = useStore();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);
  
  // Map State
  const mapRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Table Editing State
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [localTables, setLocalTables] = useState(tables);

  // Sync local tables with store when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setLocalTables(tables);
    }
  }, [tables, isEditing]);

  // Handle Map Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (draggedTable) return; // Don't pan if dragging a table
    setIsDraggingMap(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingMap) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingMap(false);
    setDraggedTable(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const scaleSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.5, scale - e.deltaY * scaleSensitivity), 3);
      setScale(newScale);
    }
  };

  const handleTableDragEnd = (id: string, info: any) => {
    if (!isEditing) return;
    
    const updatedTables = localTables.map(t => {
      if (t.id === id) {
        return {
          ...t,
          x: t.x + info.offset.x / scale, // Adjust for scale
          y: t.y + info.offset.y / scale
        };
      }
      return t;
    });
    setLocalTables(updatedTables);
  };

  const handleSaveChanges = () => {
    toast.success("Floor plan saved successfully");
    setIsEditing(false);
  };

  const selectedTable = localTables.find(t => t.id === selectedTableId);
  const floorTables = localTables.filter(t => t.floor === currentFloor && t.status !== 'hidden');

  return (
    <ConsoleLayout>
      <div className="h-full flex flex-col bg-[#FDFBF7]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#E5E0D6] bg-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#5C4033]">Table View</h1>
            <p className="text-[#8B4513] mt-1">Manage your restaurant layout by floor</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Floor Toggles */}
            <div className="flex bg-[#F5F2EA] p-1 rounded-lg mr-4">
              {[1, 2, 3].map((floor) => (
                <button
                  key={floor}
                  onClick={() => {
                    setCurrentFloor(floor);
                    setSelectedTableId(null);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    currentFloor === floor
                      ? "bg-white text-[#5C4033] shadow-sm"
                      : "text-[#8B4513]/60 hover:text-[#8B4513]"
                  )}
                >
                  {floor === 1 ? '1st Floor' : floor === 2 ? '2nd Floor' : '3rd Floor'}
                </button>
              ))}
            </div>

            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setLocalTables(tables);
                    setIsEditing(false);
                  }}
                  className="border-[#E5E0D6] text-[#8B4513] hover:bg-[#F5F2EA]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  className="bg-[#D4AF37] hover:bg-[#C4A137] text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-[#5C4033] hover:bg-[#4A332A] text-white"
              >
                <Move className="w-4 h-4 mr-2" />
                Edit Floor Plan
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map Area */}
          <div 
            className="flex-1 bg-[#F9F9F9] relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            ref={mapRef}
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                transform: `translate(${pan.x}px, ${pan.y}px)`
              }}
            />

            {/* Controls Overlay */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-20">
              <div className="bg-white rounded-lg shadow-lg border border-[#E5E0D6] p-1 flex flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-[#F5F2EA]"
                  onClick={() => setScale(s => Math.min(s + 0.1, 3))}
                >
                  <ZoomIn className="w-4 h-4 text-[#5C4033]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-[#F5F2EA]"
                  onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                >
                  <ZoomOut className="w-4 h-4 text-[#5C4033]" />
                </Button>
              </div>
              <Button
                variant="secondary"
                className="bg-white shadow-lg border border-[#E5E0D6] text-[#5C4033] hover:bg-[#F5F2EA]"
                onClick={() => {
                  setPan({ x: 0, y: 0 });
                  setScale(1);
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Scale to Fit
              </Button>
            </div>

            {/* Legend Overlay */}
            <div className="absolute bottom-8 left-8 bg-white rounded-full shadow-lg border border-[#E5E0D6] px-6 py-3 flex items-center gap-6 z-20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#5C4033]" />
                <span className="text-sm font-medium text-[#5C4033]">Available : {floorTables.filter(t => t.status === 'available').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                <span className="text-sm font-medium text-[#5C4033]">Dine in : {floorTables.filter(t => t.status === 'occupied').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="text-sm font-medium text-[#5C4033]">Reserved : {floorTables.filter(t => t.status === 'reserved').length}</span>
              </div>
            </div>

            {/* Map Container */}
            <motion.div 
              className="absolute top-0 left-0 w-[1500px] h-[1000px] origin-top-left"
              style={{ x: pan.x, y: pan.y, scale: scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {floorTables.map((table) => {
                const isSelected = selectedTableId === table.id;
                
                // Determine style based on status
                let bgClass = 'bg-white';
                let textClass = 'text-[#5C4033]';
                let borderClass = 'border-transparent';
                let statusIndicatorClass = 'bg-[#F3F4F6] text-[#6B7280]'; // Default gray

                if (table.status === 'occupied') {
                  statusIndicatorClass = 'bg-blue-50 text-blue-600';
                } else if (table.status === 'reserved') {
                  statusIndicatorClass = 'bg-red-50 text-red-600';
                } else {
                  statusIndicatorClass = 'bg-gray-50 text-gray-600';
                }

                if (isSelected) {
                  borderClass = 'border-[#D4AF37]';
                  bgClass = 'bg-white shadow-xl ring-2 ring-[#D4AF37]/20';
                }

                return (
                  <motion.div
                    key={table.id}
                    drag={isEditing}
                    dragMomentum={false}
                    onDragStart={() => setDraggedTable(table.id)}
                    onDragEnd={(e, info) => handleTableDragEnd(table.id, info)}
                    className={cn(
                      "absolute rounded-2xl flex flex-col items-center justify-center shadow-sm cursor-pointer transition-all duration-200 border-2",
                      bgClass,
                      borderClass
                    )}
                    style={{
                      left: table.x,
                      top: table.y,
                      width: table.name.startsWith('B') ? 60 : (table.seats > 4 ? 160 : 120),
                      height: table.name.startsWith('B') ? 60 : 80,
                      borderRadius: table.name.startsWith('B') ? '50%' : '16px',
                      cursor: isEditing ? 'move' : 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDraggingMap) setSelectedTableId(table.id);
                    }}
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Table Name & Status Pill */}
                    <div className={cn(
                      "px-3 py-1 rounded-lg text-sm font-bold mb-1",
                      statusIndicatorClass
                    )}>
                      {table.name}
                    </div>
                    
                    {/* Decorative "Chairs" (Visual only) */}
                    {!table.name.startsWith('B') && (
                      <div className="absolute -z-10 inset-x-4 -top-2 h-2 bg-gray-100 rounded-t-lg opacity-50" />
                    )}
                    {!table.name.startsWith('B') && (
                      <div className="absolute -z-10 inset-x-4 -bottom-2 h-2 bg-gray-100 rounded-b-lg opacity-50" />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="w-80 bg-white border-l border-[#E5E0D6] flex flex-col shadow-xl z-30">
            <div className="p-6 border-b border-[#E5E0D6]">
              <h2 className="font-serif text-xl font-bold text-[#5C4033]">Properties</h2>
              <p className="text-xs text-[#8B4513] uppercase tracking-wider mt-1">
                {selectedTable ? `Editing ${selectedTable.name}` : 'Select a table'}
              </p>
            </div>

            {selectedTable ? (
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <Label>Table Name</Label>
                  <Input 
                    value={selectedTable.name} 
                    disabled={!isEditing}
                    onChange={(e) => {
                      const updated = localTables.map(t => 
                        t.id === selectedTable.id ? { ...t, name: e.target.value } : t
                      );
                      setLocalTables(updated);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Capacity (Seats)</Label>
                  <Input 
                    type="number" 
                    value={selectedTable.seats}
                    disabled={!isEditing}
                    onChange={(e) => {
                      const updated = localTables.map(t => 
                        t.id === selectedTable.id ? { ...t, seats: parseInt(e.target.value) } : t
                      );
                      setLocalTables(updated);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Select 
                    disabled={!isEditing} 
                    value={selectedTable.floor.toString()}
                    onValueChange={(value) => {
                      const updated = localTables.map(t => 
                        t.id === selectedTable.id ? { ...t, floor: parseInt(value) } : t
                      );
                      setLocalTables(updated);
                      // If we move it to another floor, we might want to switch view or deselect
                      if (parseInt(value) !== currentFloor) {
                        setSelectedTableId(null);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Floor</SelectItem>
                      <SelectItem value="2">2nd Floor</SelectItem>
                      <SelectItem value="3">3rd Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Shape</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className={`justify-start ${!selectedTable.name.startsWith('B') ? 'border-[#D4AF37] bg-[#FFFBF0]' : ''}`}
                      disabled={!isEditing}
                      onClick={() => {
                        const updated = localTables.map(t => 
                          t.id === selectedTable.id ? { ...t, name: t.name.replace('B', 'T') } : t
                        );
                        setLocalTables(updated);
                      }}
                    >
                      <LayoutTemplate className="w-4 h-4 mr-2" />
                      Rectangular
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`justify-start ${selectedTable.name.startsWith('B') ? 'border-[#D4AF37] bg-[#FFFBF0]' : ''}`}
                      disabled={!isEditing}
                      onClick={() => {
                        const updated = localTables.map(t => 
                          t.id === selectedTable.id ? { ...t, name: t.name.replace('T', 'B') } : t
                        );
                        setLocalTables(updated);
                      }}
                    >
                      <Armchair className="w-4 h-4 mr-2" />
                      Round
                    </Button>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-6 border-t border-[#E5E0D6]">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => {
                        const updated = localTables.filter(t => t.id !== selectedTable.id);
                        setLocalTables(updated);
                        setSelectedTableId(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Table
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8B4513]/40">
                <Grid className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Select a table to view properties or edit the floor plan to make changes.</p>
                
                {isEditing && (
                  <div className="mt-8 w-full space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#5C4033] mb-2">Add New</p>
                    <Button variant="outline" className="w-full justify-start border-dashed" onClick={() => {
                      const newId = Math.random().toString(36).substr(2, 9);
                      const newTable = {
                        id: newId,
                        name: `T${localTables.length + 1}`,
                        seats: 4,
                        x: 100,
                        y: 100,
                        floor: currentFloor,
                        status: 'available' as const
                      };
                      setLocalTables([...localTables, newTable]);
                      setSelectedTableId(newId);
                    }}>
                      <LayoutTemplate className="w-4 h-4 mr-2" />
                      Add Rectangular Table
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-dashed" onClick={() => {
                      const newId = Math.random().toString(36).substr(2, 9);
                      const newTable = {
                        id: newId,
                        name: `B${localTables.length + 1}`,
                        seats: 2,
                        x: 100,
                        y: 100,
                        floor: currentFloor,
                        status: 'available' as const
                      };
                      setLocalTables([...localTables, newTable]);
                      setSelectedTableId(newId);
                    }}>
                      <Armchair className="w-4 h-4 mr-2" />
                      Add Round Table
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
}
