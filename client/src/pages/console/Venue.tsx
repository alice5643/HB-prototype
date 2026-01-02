import { useState, useRef, useEffect } from 'react';
import { useStore, Table } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus, ZoomIn, ZoomOut, Move, Grid, Trash2, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

import { ConsoleLayout } from '@/components/ConsoleLayout';

export default function ConsoleVenue() {
  const { tables, floors, addFloor, updateFloorName, addTable, updateTable, deleteTable } = useStore();
  const [activeFloorId, setActiveFloorId] = useState<number>(1);
  const [isEditingFloor, setIsEditingFloor] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingFloorNameId, setEditingFloorNameId] = useState<number | null>(null);
  const [tempFloorName, setTempFloorName] = useState('');

  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter tables for current floor
  const currentFloorTables = tables ? tables.filter(t => t.floor === activeFloorId) : [];

  // Initialize active floor if needed
  useEffect(() => {
    if (floors && floors.length > 0 && !floors.find(f => f.id === activeFloorId)) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors, activeFloorId]);

  if (!floors) return <ConsoleLayout><div>Loading...</div></ConsoleLayout>;

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(s => Math.min(Math.max(s * delta, 0.5), 3));
    }
  };

  const handleMouseDownMap = (e: React.MouseEvent) => {
    if (selectedTableId && !draggedTable) {
      setSelectedTableId(null);
    }
    if (e.button === 0 && !draggedTable) { // Left click only
      setIsDraggingMap(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMoveMap = (e: React.MouseEvent) => {
    if (isDraggingMap) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    if (draggedTable && isEditingFloor) {
      const mapRect = mapRef.current?.getBoundingClientRect();
      if (mapRect) {
        const x = (e.clientX - mapRect.left - dragOffset.x) / scale;
        const y = (e.clientY - mapRect.top - dragOffset.y) / scale;
        
        // Snap to grid (20px)
        const snappedX = Math.round(x / 20) * 20;
        const snappedY = Math.round(y / 20) * 20;

        const table = tables.find(t => t.id === draggedTable);
        if (table) {
          updateTable({ ...table, x: snappedX, y: snappedY });
        }
      }
    }
  };

  const handleMouseUpMap = () => {
    setIsDraggingMap(false);
    setDraggedTable(null);
  };

  const handleTableMouseDown = (e: React.MouseEvent, table: Table) => {
    e.stopPropagation();
    setSelectedTableId(table.id);
    
    if (isEditingFloor) {
      setDraggedTable(table.id);
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleAddTable = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newTable: Table = {
      id: newId,
      name: `T${currentFloorTables.length + 1}`,
      seats: 4,
      x: 100, // Default position
      y: 100,
      floor: activeFloorId,
      status: 'available'
    };
    addTable(newTable);
    setSelectedTableId(newId);
    // Ensure we're in edit mode so user can move it immediately
    if (!isEditingFloor) setIsEditingFloor(true);
  };

  const handleScaleToFit = () => {
    if (currentFloorTables.length === 0) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      return;
    }

    const minX = Math.min(...currentFloorTables.map(t => t.x));
    const maxX = Math.max(...currentFloorTables.map(t => t.x + (t.seats > 4 ? 120 : 80)));
    const minY = Math.min(...currentFloorTables.map(t => t.y));
    const maxY = Math.max(...currentFloorTables.map(t => t.y + 60));

    const padding = 100;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const containerWidth = containerRef.current?.clientWidth || 1000;
    const containerHeight = containerRef.current?.clientHeight || 600;

    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;
    const newScale = Math.min(scaleX, scaleY, 1); // Don't zoom in past 100%

    setScale(newScale);
    setPosition({
      x: (containerWidth - width * newScale) / 2 - minX * newScale + padding * newScale,
      y: (containerHeight - height * newScale) / 2 - minY * newScale + padding * newScale
    });
  };

  const startEditingFloorName = (floor: { id: number; name: string }) => {
    setEditingFloorNameId(floor.id);
    setTempFloorName(floor.name);
  };

  const saveFloorName = () => {
    if (editingFloorNameId !== null && tempFloorName.trim()) {
      updateFloorName(editingFloorNameId, tempFloorName.trim());
      setEditingFloorNameId(null);
    }
  };

  const selectedTable = tables.find(t => t.id === selectedTableId);

  return (
    <ConsoleLayout>
      <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-display text-3xl text-primary-900">Table View</h1>
          <p className="text-primary-600 mt-1">Manage your restaurant layout by floor</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Floor Toggles */}
          <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-primary-100">
            {floors.map(floor => (
              <div key={floor.id} className="relative group">
                {editingFloorNameId === floor.id ? (
                  <div className="flex items-center px-2 py-1">
                    <Input
                      value={tempFloorName}
                      onChange={(e) => setTempFloorName(e.target.value)}
                      className="h-7 w-24 text-sm px-2"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveFloorName();
                        if (e.key === 'Escape') setEditingFloorNameId(null);
                      }}
                    />
                    <Button size="icon" variant="ghost" className="h-7 w-7 ml-1 text-green-600" onClick={saveFloorName}>
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => setEditingFloorNameId(null)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant={activeFloorId === floor.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveFloorId(floor.id)}
                    onDoubleClick={() => startEditingFloorName(floor)}
                    className={cn(
                      "relative px-4 transition-all",
                      activeFloorId === floor.id && "bg-primary-50 text-primary-900 font-medium shadow-sm"
                    )}
                  >
                    {floor.name}
                    {activeFloorId === floor.id && (
                      <Edit2 
                        className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-50 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingFloorName(floor);
                        }}
                      />
                    )}
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={addFloor}
              className="px-2 text-primary-400 hover:text-primary-600"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            variant={isEditingFloor ? "default" : "outline"}
            className={cn(
              "gap-2 transition-all",
              isEditingFloor ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent" : "text-amber-600 border-amber-200 hover:bg-amber-50"
            )}
            onClick={() => setIsEditingFloor(!isEditingFloor)}
          >
            {isEditingFloor ? (
              <>
                <Check className="w-4 h-4" />
                Done Editing
              </>
            ) : (
              <>
                <Move className="w-4 h-4" />
                Edit Floor Plan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map Area */}
        <div className="flex-1 relative bg-stone-50 rounded-xl border border-primary-100 overflow-hidden shadow-inner flex flex-col">
          <div 
            ref={containerRef}
            className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDownMap}
            onMouseMove={handleMouseMoveMap}
            onMouseUp={handleMouseUpMap}
            onMouseLeave={handleMouseUpMap}
          >
            {/* Grid Background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                backgroundSize: `${20 * scale}px ${20 * scale}px`,
                backgroundPosition: `${position.x}px ${position.y}px`
              }}
            />

            {/* Map Content */}
            <div
              ref={mapRef}
              className="absolute origin-top-left transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
              }}
            >
              {currentFloorTables.map(table => (
                <div
                  key={table.id}
                  className={cn(
                    "absolute flex items-center justify-center transition-colors duration-200",
                    isEditingFloor ? "cursor-move" : "cursor-pointer",
                    selectedTableId === table.id ? "ring-2 ring-amber-500 ring-offset-2 z-10" : "hover:ring-1 hover:ring-primary-200"
                  )}
                  style={{
                    left: table.x,
                    top: table.y,
                    width: table.seats > 4 ? 120 : 80,
                    height: 60,
                  }}
                  onMouseDown={(e) => handleTableMouseDown(e, table)}
                >
                  {/* Table Shape */}
                  <div className={cn(
                    "w-full h-full rounded-lg border shadow-sm flex items-center justify-center relative",
                    table.status === 'occupied' ? "bg-blue-50 border-blue-200" :
                    table.status === 'reserved' ? "bg-red-50 border-red-200" :
                    "bg-white border-stone-200"
                  )}>
                    {/* Chairs */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-stone-200 rounded-full" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-stone-200 rounded-full" />
                    {table.seats > 2 && (
                      <>
                        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1 h-1/2 bg-stone-200 rounded-full" />
                        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1 h-1/2 bg-stone-200 rounded-full" />
                      </>
                    )}

                    <span className={cn(
                      "font-medium text-sm",
                      table.status === 'occupied' ? "text-blue-700" :
                      table.status === 'reserved' ? "text-red-700" :
                      "text-stone-600"
                    )}>
                      {table.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <div className="bg-white rounded-lg shadow-lg border border-primary-100 p-1 flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setScale(s => Math.min(s + 0.1, 3))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="shadow-lg bg-white hover:bg-stone-50 text-primary-700"
              onClick={handleScaleToFit}
            >
              <Grid className="w-4 h-4 mr-2" />
              Scale to Fit
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-full shadow-lg border border-primary-100 px-4 py-2 flex items-center gap-4 text-xs font-medium text-primary-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-stone-600" />
              Available : {currentFloorTables.filter(t => t.status === 'available').length}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              Dine in : {currentFloorTables.filter(t => t.status === 'occupied').length}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Reserved : {currentFloorTables.filter(t => t.status === 'reserved').length}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 shrink-0 flex flex-col gap-4">
          <Card className="p-4 h-full border-primary-100 shadow-sm bg-white">
            <div className="mb-6">
              <h2 className="font-display text-xl text-primary-900">Properties</h2>
              <p className="text-sm text-primary-500 uppercase tracking-wider mt-1">
                {selectedTable ? 'Edit Table Details' : 'Select a Table'}
              </p>
            </div>

            {selectedTable ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Table Name</Label>
                  <Input 
                    value={selectedTable.name}
                    onChange={(e) => updateTable({ ...selectedTable, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Seats</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateTable({ ...selectedTable, seats: Math.max(1, selectedTable.seats - 1) })}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="flex-1 text-center font-medium">{selectedTable.seats}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateTable({ ...selectedTable, seats: selectedTable.seats + 1 })}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={selectedTable.status}
                    onValueChange={(value: any) => updateTable({ ...selectedTable, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-primary-100">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      deleteTable(selectedTable.id);
                      setSelectedTableId(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Table
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-primary-400">
                <Grid className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Select a table to view properties or edit the floor plan to make changes.</p>
                
                {isEditingFloor && (
                  <Button className="mt-6 w-full" onClick={handleAddTable}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Table
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
      </div>
    </ConsoleLayout>
  );
}
