import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ConsoleLayout } from '@/components/ConsoleLayout';
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  Grid,
  LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function ConsoleVenue() {
  const { tables, floors, updateTable, updateTableStatus, addFloor, updateFloorName, addTable, deleteTable } = useStore();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [activeFloorId, setActiveFloorId] = useState<number>(1);
  const [editingFloorId, setEditingFloorId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  
  // Map Panning & Zooming State
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize active floor if needed
  useEffect(() => {
    if (floors && floors.length > 0 && !floors.find(f => f.id === activeFloorId)) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors, activeFloorId]);

  // Filter tables for current floor
  const currentFloorTables = tables ? tables.filter(t => t.floor === activeFloorId && t.status !== 'hidden') : [];

  // Handle Drag-to-Pan (only when not dragging a table)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking background
    if ((e.target as HTMLElement).closest('.table-element')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleSensitivity = 0.001;
    const newScale = Math.min(Math.max(0.5, scale - e.deltaY * scaleSensitivity), 3);
    setScale(newScale);
  };

  const handleScaleToFit = () => {
    if (currentFloorTables.length === 0) {
      setScale(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    const minX = Math.min(...currentFloorTables.map(t => t.x));
    const maxX = Math.max(...currentFloorTables.map(t => t.x + (t.seats > 4 ? 160 : 100)));
    const minY = Math.min(...currentFloorTables.map(t => t.y));
    const maxY = Math.max(...currentFloorTables.map(t => t.y + 100));

    const padding = 100;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const containerWidth = containerRef.current?.clientWidth || 1000;
    const containerHeight = containerRef.current?.clientHeight || 600;

    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;
    const newScale = Math.min(scaleX, scaleY, 1); // Don't zoom in past 100%

    setScale(newScale);
    setPan({
      x: (containerWidth - width * newScale) / 2 - minX * newScale + padding * newScale,
      y: (containerHeight - height * newScale) / 2 - minY * newScale + padding * newScale
    });
  };

  const handleAddFloor = () => {
    addFloor();
  };

  const startEditingFloor = (floor: { id: number, name: string }) => {
    setEditingFloorId(floor.id);
    setEditingName(floor.name);
  };

  const saveFloorName = () => {
    if (editingFloorId) {
      updateFloorName(editingFloorId, editingName);
      setEditingFloorId(null);
    }
  };

  const handleAddTable = () => {
    // Find a free spot in the center of the view
    const centerX = (-pan.x + (containerRef.current?.clientWidth || 1000) / 2) / scale;
    const centerY = (-pan.y + (containerRef.current?.clientHeight || 600) / 2) / scale;
    
    const newId = Math.random().toString(36).substring(2, 9);
    addTable({
      id: newId,
      name: `T${currentFloorTables.length + 1}`,
      seats: 4,
      x: centerX,
      y: centerY,
      floor: activeFloorId,
      status: 'available'
    });
    setSelectedTableId(newId);
  };

  const selectedTable = selectedTableId ? tables.find(t => t.id === selectedTableId) : null;

  return (
    <ConsoleLayout>
      <div className="flex flex-col h-full bg-[#F9F9F9]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center shrink-0">
          <div>
            <h1 className="font-serif text-3xl text-[#2C2C2C]">Table View</h1>
            <p className="text-gray-500 mt-1">Manage your restaurant layout by floor</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Floor Tabs */}
            <div className="flex items-center bg-[#F5F2EA] rounded-lg p-1">
              {floors && floors.map(floor => (
                <div key={floor.id} className="relative group">
                  {editingFloorId === floor.id ? (
                    <div className="flex items-center px-2 py-1">
                      <Input 
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-7 w-24 text-sm bg-white"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveFloorName()}
                      />
                      <button onClick={saveFloorName} className="ml-1 text-green-600 hover:text-green-700">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant={activeFloorId === floor.id ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setActiveFloorId(floor.id)}
                      onDoubleClick={() => startEditingFloor(floor)}
                      className={cn(
                        "relative px-4 transition-all text-[#8B4513]",
                        activeFloorId === floor.id && "bg-white shadow-sm font-medium"
                      )}
                    >
                      {floor.name}
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEditingFloor(floor); }}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#8B4513]/50 hover:text-[#8B4513]"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddFloor}
                className="px-2 text-[#8B4513]/70 hover:text-[#8B4513] hover:bg-[#D4AF37]/10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(
                "gap-2 transition-all",
                isEditMode 
                  ? "bg-[#D4AF37] hover:bg-[#C4A030] text-white shadow-md" 
                  : "bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#FFFBF0]"
              )}
            >
              {isEditMode ? <Check className="w-4 h-4" /> : <Move className="w-4 h-4" />}
              {isEditMode ? 'Done Editing' : 'Edit Floor Plan'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map Area */}
          <div 
            ref={containerRef}
            className="flex-1 bg-[#F9F9F9] relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDragging) {
                setSelectedTableId(null);
              }
            }}
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(#8B4513 1px, transparent 1px), linear-gradient(90deg, #8B4513 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
              }}
            />

            {/* Map Content */}
            <motion.div 
              ref={mapRef}
              className="absolute top-0 left-0 origin-top-left"
              style={{ x: pan.x, y: pan.y, scale: scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {currentFloorTables.map((table) => {
                const isSelected = selectedTableId === table.id;
                
                // Determine style based on status
                let statusStyles = 'bg-white border-[#E5E5E5] hover:border-[#D4AF37]/50';
                if (table.status === 'occupied') statusStyles = 'bg-white border-[#2C2C2C] border-2';
                if (table.status === 'reserved') statusStyles = 'bg-[#F5F2EA] border-dashed border-[#8B4513]/30';
                if (table.status === 'cleaning') statusStyles = 'bg-gray-100 border-gray-200 opacity-70';
                
                if (isSelected) statusStyles = 'bg-[#D4AF37] border-[#D4AF37] text-white scale-110 z-10 shadow-xl';

                return (
                  <motion.div
                    key={table.id}
                    className={`absolute rounded-2xl border-2 flex flex-col items-center justify-center shadow-md cursor-pointer transition-all duration-300 table-element ${statusStyles}`}
                    style={{
                      left: table.x,
                      top: table.y,
                      width: table.name.startsWith('B') ? 60 : (table.seats > 4 ? 160 : 100),
                      height: table.name.startsWith('B') ? 60 : 100,
                      borderRadius: table.name.startsWith('B') ? '50%' : '1rem'
                    }}
                    drag={isEditMode}
                    dragMomentum={false}
                    onDragEnd={(_, info) => {
                      if (isEditMode) {
                        updateTable({ ...table, x: table.x + info.offset.x, y: table.y + info.offset.y });
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTableId(table.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Chairs - Visual Only */}
                    {!table.name.startsWith('B') && (
                      <>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#8B4513]/20 rounded-full" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#8B4513]/20 rounded-full" />
                        {table.seats > 2 && (
                          <>
                            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1 h-1/2 bg-[#8B4513]/20 rounded-full" />
                            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1 h-1/2 bg-[#8B4513]/20 rounded-full" />
                          </>
                        )}
                      </>
                    )}

                    <span className={`font-serif font-bold ${isSelected ? 'text-white' : 'text-[#2C2C2C]'} ${table.name.startsWith('B') ? 'text-sm' : 'text-lg'}`}>
                      {table.name}
                    </span>
                    {table.status === 'occupied' && (
                      <span className="text-[10px] font-medium text-[#8B4513] mt-1 bg-[#F5F2EA] px-1.5 py-0.5 rounded-full">
                        00:45
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Map Controls */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1">
                <button 
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors"
                  onClick={() => setScale(s => Math.min(s + 0.2, 3))}
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button 
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors"
                  onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
              </div>
              <Button 
                variant="outline" 
                className="bg-white shadow-lg border-gray-100 text-gray-700 hover:bg-gray-50"
                onClick={handleScaleToFit}
              >
                <Maximize className="w-4 h-4 mr-2" />
                Scale to Fit
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur rounded-full shadow-lg border border-[#D4AF37]/20 px-6 py-3 flex items-center gap-6 z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border border-[#E5E5E5]" />
                <span className="text-sm text-[#5C4033]">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#2C2C2C]" />
                <span className="text-sm text-[#5C4033]">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F5F2EA] border-dashed border-[#8B4513]/30" />
                <span className="text-sm text-[#5C4033]">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border border-[#D4AF37] shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
                <span className="text-sm text-[#5C4033]">Request</span>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10 shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-serif text-xl text-[#2C2C2C]">Properties</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedTable ? `Editing ${selectedTable.name}` : 'SELECT A TABLE'}
              </p>
            </div>

            {selectedTable ? (
              <div className="p-6 flex flex-col gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Table Name</label>
                    <Input 
                      value={selectedTable.name}
                      onChange={(e) => updateTable({ ...selectedTable, name: e.target.value })}
                      className="font-serif text-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Capacity</label>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateTable({ ...selectedTable, seats: Math.max(1, selectedTable.seats - 1) })}
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center font-medium text-lg">{selectedTable.seats}</div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateTable({ ...selectedTable, seats: selectedTable.seats + 1 })}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['available', 'occupied', 'reserved', 'cleaning'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateTableStatus(selectedTable.id, status as any)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all border",
                            selectedTable.status === status
                              ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#D4AF37]/50"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-auto">
                  <Button 
                    variant="destructive" 
                    className="w-full gap-2"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this table?')) {
                        deleteTable(selectedTable.id);
                        setSelectedTableId(null);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Table
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <Grid className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Select a table to view properties or edit the floor plan to make changes.</p>
                
                {isEditMode && (
                  <Button 
                    className="mt-8 bg-[#D4AF37] hover:bg-[#C4A030] text-white gap-2"
                    onClick={handleAddTable}
                  >
                    <Plus className="w-4 h-4" />
                    Add Table
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
}
