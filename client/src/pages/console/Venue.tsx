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
  Users
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

export default function ConsoleVenue() {
  const { tables, updateTableStatus, resetTables } = useStore();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
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
    } else if (draggedTable && isEditing) {
      // Handle table dragging logic here if needed for smooth updates
      // Currently handled by motion.div drag prop
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
    // In a real app, this would update the backend
    // For now, we'll just update the store (if we had a setTables action)
    // Since we don't have setTables, we'll simulate saving
    toast.success("Floor plan saved successfully");
    setIsEditing(false);
  };

  const selectedTable = localTables.find(t => t.id === selectedTableId);

  return (
    <ConsoleLayout>
      <div className="h-full flex flex-col bg-[#FDFBF7]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#E5E0D6] bg-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#5C4033]">Venue Setup</h1>
            <p className="text-[#8B4513] mt-1">Configure your floor plan and table arrangements</p>
          </div>
          <div className="flex items-center gap-3">
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
            className="flex-1 bg-[#F0EAD6] relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            ref={mapRef}
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                transform: `translate(${pan.x}px, ${pan.y}px)`
              }}
            />

            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white shadow-md hover:bg-[#F5F2EA]"
                onClick={() => setScale(s => Math.min(s + 0.1, 3))}
              >
                <ZoomIn className="w-4 h-4 text-[#5C4033]" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white shadow-md hover:bg-[#F5F2EA]"
                onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
              >
                <ZoomOut className="w-4 h-4 text-[#5C4033]" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white shadow-md hover:bg-[#F5F2EA]"
                onClick={() => {
                  setPan({ x: 0, y: 0 });
                  setScale(1);
                }}
              >
                <RotateCcw className="w-4 h-4 text-[#5C4033]" />
              </Button>
            </div>

            {/* Map Container */}
            <motion.div 
              className="absolute top-0 left-0 w-[1500px] h-[1000px] origin-top-left"
              style={{ x: pan.x, y: pan.y, scale: scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {localTables.filter(t => t.status !== 'hidden').map((table) => {
                const isSelected = selectedTableId === table.id;
                
                // Determine style based on status
                let statusStyles = 'bg-white border-[#E5E5E5]';
                if (table.status === 'occupied') statusStyles = 'bg-white border-[#2C2C2C] border-2';
                if (table.status === 'reserved') statusStyles = 'bg-[#F5F2EA] border-dashed border-[#8B4513]/30';
                if (isSelected) statusStyles = 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-xl z-10';

                return (
                  <motion.div
                    key={table.id}
                    drag={isEditing}
                    dragMomentum={false}
                    onDragStart={() => setDraggedTable(table.id)}
                    onDragEnd={(e, info) => handleTableDragEnd(table.id, info)}
                    className={`absolute rounded-2xl border-2 flex flex-col items-center justify-center shadow-md cursor-pointer transition-colors duration-200 ${statusStyles}`}
                    style={{
                      left: table.x,
                      top: table.y,
                      width: table.name.startsWith('B') ? 60 : (table.seats > 4 ? 160 : 100),
                      height: table.name.startsWith('B') ? 60 : 100,
                      borderRadius: table.name.startsWith('B') ? '50%' : '1rem',
                      cursor: isEditing ? 'move' : 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDraggingMap) setSelectedTableId(table.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`font-serif font-bold ${isSelected ? 'text-white' : 'text-[#2C2C2C]'} ${table.name.startsWith('B') ? 'text-sm' : 'text-lg'}`}>
                      {table.name}
                    </span>
                    {!table.name.startsWith('B') && (
                      <div className="flex items-center gap-1 mt-1">
                        <Users className={`w-3 h-3 ${isSelected ? 'text-white/80' : 'text-gray-400'}`} />
                        <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>{table.seats}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="w-80 bg-white border-l border-[#E5E0D6] flex flex-col">
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
                  <Label>Zone</Label>
                  <Select 
                    disabled={!isEditing} 
                    defaultValue="main"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Dining</SelectItem>
                      <SelectItem value="terrace">Terrace</SelectItem>
                      <SelectItem value="bar">Bar Area</SelectItem>
                      <SelectItem value="private">Private Room</SelectItem>
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
                    <Button variant="outline" className="w-full justify-start border-dashed">
                      <LayoutTemplate className="w-4 h-4 mr-2" />
                      Add Rectangular Table
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-dashed">
                      <Armchair className="w-4 h-4 mr-2" />
                      Add Round Table
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-dashed">
                      <Sofa className="w-4 h-4 mr-2" />
                      Add Booth
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
