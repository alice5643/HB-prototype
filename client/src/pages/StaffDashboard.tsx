import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  GlassWater, 
  ChefHat,
  X,
  ChevronRight,
  MapPin,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  ZoomIn,
  ZoomOut,
  Grid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Timer Component
const TableTimer = ({ startTime }: { startTime?: number }) => {
  const [elapsed, setElapsed] = useState('00:00');

  useEffect(() => {
    if (!startTime) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - startTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setElapsed(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <span className="font-serif text-[#2C2C2C] font-medium">{elapsed}</span>;
};

export default function StaffDashboard() {
  const { serviceRequests, updateServiceRequestStatus, orders, toggleOrderServed, sharingModel, partySize, tables, floors, updateTableStatus, joinTables, splitTable, resetTables, simulateRequest } = useStore();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false); // State for join mode
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [activeFloorId, setActiveFloorId] = useState<number>(1);
  
  // Map Panning & Zooming State
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Initialize active floor if needed
  useEffect(() => {
    if (floors && floors.length > 0 && !floors.find(f => f.id === activeFloorId)) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors, activeFloorId]);

  // Filter tables for current floor
  const currentFloorTables = tables ? tables.filter(t => t.floor === activeFloorId && t.status !== 'hidden') : [];

  // Handle Drag-to-Pan
  const handleMouseDown = (e: React.MouseEvent) => {
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
    setPan({
      x: (containerWidth - width * newScale) / 2 - minX * newScale + padding * newScale,
      y: (containerHeight - height * newScale) / 2 - minY * newScale + padding * newScale
    });
  };

  // Filter requests for the selected table
  const tableRequests = selectedTableId 
    ? serviceRequests.filter(r => r.tableNumber === tables.find(t => t.id === selectedTableId)?.name.replace('T', ''))
    : [];

  const activeRequests = tableRequests.filter(r => r.status !== 'completed');
  const completedRequests = tableRequests.filter(r => r.status === 'completed');

  // Filter orders for the selected table
  const tableOrders = selectedTableId
    ? orders // In a real app, we would filter by tableId here. For demo, we assume all orders are for the current user (T12)
    : [];
    
  const activeOrders = tableOrders.filter(o => !o.served);
  const servedOrders = tableOrders.filter(o => o.served);

  const selectedTable = selectedTableId ? tables.find(t => t.id === selectedTableId) : null;

  // Calculate Bill Total
  const billTotal = tableOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Get requests for a specific table to show indicators
  const getTableRequests = (tableId: string) => {
    const tableName = tables.find(t => t.id === tableId)?.name.replace('T', '');
    return serviceRequests.filter(r => r.tableNumber === tableName && r.status !== 'completed');
  };

  return (
    <div className="staff-dashboard-wrapper min-h-screen bg-[#2C2C2C] flex items-center justify-center p-0 md:p-4 lg:p-8 overflow-hidden">
      {/* Tablet Container - Fluid Max Width */}
      <div className="w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-[1600px] bg-[#F5F2EA] md:rounded-[32px] md:shadow-2xl overflow-hidden flex flex-col relative md:border-[12px] md:border-[#1a1a1a]">
        
        {/* Header */}
        <div className="bg-[#FFFBF0] border-b border-[#D4AF37]/20 p-4 flex justify-between items-center z-20 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#FFFBF0] font-serif font-bold text-xl">
              S
            </div>
            <div>
              <h1 className="font-serif text-[#2C2C2C] text-lg font-medium leading-tight">Savoy</h1>
              <p className="text-[#8B4513] text-xs tracking-wider uppercase">Staff Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Floor Toggles */}
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-[#D4AF37]/20">
              {floors && floors.map(floor => (
                <Button
                  key={floor.id}
                  variant={activeFloorId === floor.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFloorId(floor.id)}
                  className={cn(
                    "relative px-4 transition-all",
                    activeFloorId === floor.id && "bg-[#D4AF37]/10 text-[#8B4513] font-medium shadow-sm"
                  )}
                >
                  {floor.name}
                </Button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#D4AF37]/20 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-[#5C4033]">Live Service</span>
            </div>
            <button 
              className="px-3 py-1.5 bg-[#FFFBF0] border border-[#D4AF37]/30 rounded-full text-[#8B4513] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F2EA] transition-colors flex items-center gap-1"
              onClick={() => {
                simulateRequest();
                setSelectedTableId(null); // Deselect table to show Shift Activity feed
              }}
            >
              <Bell className="w-3 h-3" />
              Simulate
            </button>
            <button 
              className="p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors text-[#5C4033] text-xs font-medium flex items-center gap-1"
              onClick={() => {
                if (confirm('Reset floor plan to default state?')) {
                  resetTables();
                  setSelectedTableId(null);
                }
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Main Content Area - Split View */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left: Interactive Floor Plan (Pannable & Zoomable) */}
          <div 
            ref={containerRef}
            className="flex-1 bg-[#F0EAD6] relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={(e) => {
              // Only deselect if clicking the background (not a table) and not dragging
              if (e.target === e.currentTarget && !isDragging) {
                setSelectedTableId(null);
              }
            }}
          >
            {/* Grid Pattern Background */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                transform: `translate(${pan.x}px, ${pan.y}px)`
              }}
            />

            {/* Draggable & Zoomable Map Container */}
            <motion.div 
              ref={mapRef}
              className="absolute top-0 left-0 origin-top-left"
              style={{ x: pan.x, y: pan.y, scale: scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {currentFloorTables.map((table) => {
                const requests = getTableRequests(table.id);
                const hasRequests = requests.length > 0;
                const isSelected = selectedTableId === table.id;
                
                return (
                  <motion.div
                    key={table.id}
                    className={cn(
                      "absolute flex items-center justify-center transition-colors duration-200 cursor-pointer",
                      isSelected ? "ring-2 ring-[#D4AF37] ring-offset-2 z-10" : "hover:ring-1 hover:ring-[#D4AF37]/50"
                    )}
                    style={{
                      left: table.x,
                      top: table.y,
                      width: table.seats > 4 ? 120 : 80,
                      height: 60,
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent drag start
                      if (isJoining && selectedTableId && selectedTableId !== table.id) {
                        // Join logic: Join selected table INTO the clicked table
                        joinTables(selectedTableId, table.id);
                        setSelectedTableId(table.id); // Select the new merged table
                      } else {
                        setSelectedTableId(table.id);
                        if (selectedTableId === table.id && isJoining) {
                           setIsJoining(false);
                        }
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Table Shape */}
                    <div className={cn(
                      "w-full h-full rounded-lg border shadow-sm flex items-center justify-center relative",
                      table.status === 'occupied' ? "bg-white border-[#2C2C2C] border-2" :
                      table.status === 'reserved' ? "bg-[#F5F2EA] border-dashed border-[#8B4513]/30" :
                      table.status === 'cleaning' ? "bg-gray-100 border-gray-200 opacity-70" :
                      "bg-white border-[#E5E5E5]",
                      hasRequests && "animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.5)] border-[#D4AF37]",
                      isSelected && "bg-[#FFFBF0] border-[#D4AF37]"
                    )}>
                      {/* Chairs */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#D4AF37]/20 rounded-full" />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#D4AF37]/20 rounded-full" />
                      {table.seats > 2 && (
                        <>
                          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1 h-1/2 bg-[#D4AF37]/20 rounded-full" />
                          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1 h-1/2 bg-[#D4AF37]/20 rounded-full" />
                        </>
                      )}

                      <div className="flex flex-col items-center">
                        <span className={cn(
                          "font-serif font-bold",
                          table.status === 'occupied' ? "text-[#2C2C2C]" :
                          table.status === 'reserved' ? "text-[#8B4513]" :
                          "text-[#5C4033]",
                          table.name.startsWith('B') ? 'text-sm' : 'text-lg'
                        )}>
                          {table.name}
                        </span>
                        {table.status === 'occupied' && table.seatedTime && (
                          <div className="text-[10px] font-medium text-[#8B4513] mt-0.5">
                            <TableTimer startTime={table.seatedTime} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <div className="bg-white rounded-lg shadow-lg border border-[#D4AF37]/20 p-1 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-[#F5F2EA] text-[#8B4513]"
                  onClick={() => setScale(s => Math.min(s + 0.1, 3))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-[#F5F2EA] text-[#8B4513]"
                  onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="shadow-lg bg-white hover:bg-[#F5F2EA] text-[#8B4513] border border-[#D4AF37]/20"
                onClick={handleScaleToFit}
              >
                <Grid className="w-4 h-4 mr-2" />
                Scale to Fit
              </Button>
            </div>
          </div>

          {/* Right: Detail Panel (Slide Over) */}
          <AnimatePresence mode="wait">
            {selectedTable ? (
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-[400px] bg-white border-l border-[#D4AF37]/20 shadow-2xl z-10 flex flex-col h-full"
              >
                {/* Table Header */}
                <div className="p-6 border-b border-[#F5F2EA] bg-[#FFFBF0]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#2C2C2C]">Table {selectedTable.name}</h2>
                      <div className="flex items-center gap-2 mt-1 text-[#8B4513] text-sm">
                        <Users className="w-4 h-4" />
                        <span>{selectedTable.seats} Seats</span>
                        <span className="text-[#D4AF37]">•</span>
                        <span>{selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTableId(null)}
                      className="p-2 hover:bg-[#D4AF37]/10 rounded-full text-[#8B4513] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    {selectedTable.status === 'available' && (
                      <button 
                        onClick={() => updateTableStatus(selectedTable.id, 'occupied')}
                        className="col-span-2 py-3 bg-[#2C2C2C] text-[#FFFBF0] rounded-xl font-medium hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Seat Guests
                      </button>
                    )}
                    {selectedTable.status === 'occupied' && (
                      <>
                        <button 
                          onClick={() => updateTableStatus(selectedTable.id, 'cleaning')}
                          className="py-3 bg-[#F5F2EA] text-[#8B4513] rounded-xl font-medium hover:bg-[#EBE5D5] transition-colors border border-[#D4AF37]/20"
                        >
                          Clear Table
                        </button>
                        <button 
                          onClick={() => setIsJoining(!isJoining)}
                          className={`py-3 rounded-xl font-medium transition-colors border border-[#D4AF37]/20 flex items-center justify-center gap-2 ${isJoining ? 'bg-[#D4AF37] text-white' : 'bg-[#F5F2EA] text-[#8B4513] hover:bg-[#EBE5D5]'}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                          {isJoining ? 'Select Table to Join' : 'Join Table'}
                        </button>
                      </>
                    )}
                    {selectedTable.status === 'cleaning' && (
                      <button 
                        onClick={() => updateTableStatus(selectedTable.id, 'available')}
                        className="col-span-2 py-3 bg-[#4CAF50] text-white rounded-xl font-medium hover:bg-[#45a049] transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark Ready
                      </button>
                    )}
                    {selectedTable.mergedIds && selectedTable.mergedIds.length > 0 && (
                       <button 
                          onClick={() => splitTable(selectedTable.id)}
                          className="col-span-2 py-3 bg-[#F5F2EA] text-[#8B4513] rounded-xl font-medium hover:bg-[#EBE5D5] transition-colors border border-[#D4AF37]/20"
                        >
                          Split Tables
                        </button>
                    )}
                  </div>
                </div>

                {/* Content Tabs */}
                <div className="flex-1 overflow-y-auto">
                  {selectedTable.status === 'occupied' ? (
                    <div className="p-6 space-y-8">
                      {/* Service Requests */}
                      <section>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-serif text-lg text-[#2C2C2C] flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[#D4AF37]" />
                            Service Requests
                          </h3>
                          {activeRequests.length > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                              {activeRequests.length} New
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {activeRequests.length === 0 && (
                            <div className="text-center py-8 bg-[#F9F9F9] rounded-xl border border-dashed border-gray-200">
                              <p className="text-gray-400 text-sm">No active requests</p>
                            </div>
                          )}
                          {activeRequests.map(req => (
                            <motion.div 
                              key={req.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white border border-red-100 shadow-sm rounded-xl p-4 flex items-start gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                <AlertCircle className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-[#2C2C2C] capitalize">{req.type}</p>
                                {req.details && <p className="text-sm text-gray-500 mt-1">{req.details}</p>}
                                <p className="text-xs text-gray-400 mt-2">{format(req.timestamp, 'h:mm a')}</p>
                              </div>
                              <button 
                                onClick={() => updateServiceRequestStatus(req.id, 'completed')}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                              >
                                Resolve
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </section>

                      {/* Active Orders */}
                      <section>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-serif text-lg text-[#2C2C2C] flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-[#D4AF37]" />
                            Current Orders
                          </h3>
                          <span className="text-[#8B4513] font-medium">${billTotal.toFixed(2)}</span>
                        </div>

                        <div className="space-y-3">
                          {activeOrders.length === 0 && (
                            <div className="text-center py-8 bg-[#F9F9F9] rounded-xl border border-dashed border-gray-200">
                              <p className="text-gray-400 text-sm">No active orders</p>
                            </div>
                          )}
                          {activeOrders.map(order => (
                            <div key={order.id} className="bg-white border border-[#F5F2EA] rounded-xl p-4 flex gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                <img src={order.image} alt={order.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-[#2C2C2C]">{order.name}</p>
                                    <p className="text-sm text-gray-500">{order.quantity}x • ${order.price}</p>
                                  </div>
                                  <button 
                                    onClick={() => toggleOrderServed(order.id, order.selectedVariationId)}
                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                </div>
                                {order.selectedVariationName && (
                                  <p className="text-xs text-[#8B4513] mt-1 bg-[#FFFBF0] inline-block px-2 py-0.5 rounded">
                                    {order.selectedVariationName}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
                      <div className="w-16 h-16 rounded-full bg-[#F5F2EA] flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-[#D4AF37]/50" />
                      </div>
                      <p className="font-medium text-[#2C2C2C]">Table is {selectedTable.status}</p>
                      <p className="text-sm mt-2">Seat guests to view orders and requests</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-[400px] bg-white border-l border-[#D4AF37]/20 shadow-2xl z-10 flex flex-col h-full"
              >
                <div className="p-6 border-b border-[#F5F2EA] bg-[#FFFBF0]">
                  <h2 className="font-serif text-2xl text-[#2C2C2C]">Shift Activity</h2>
                  <p className="text-[#8B4513] text-sm mt-1">Live updates from the floor</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Recent Requests Feed */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Requests</h3>
                      <div className="space-y-4">
                        {serviceRequests.slice(0, 5).map(req => (
                          <div key={req.id} className="flex gap-3 items-start">
                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${req.status === 'completed' ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`} />
                            <div>
                              <p className="text-sm font-medium text-[#2C2C2C]">
                                Table {req.tableNumber} • <span className="capitalize">{req.type}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{format(req.timestamp, 'h:mm a')}</p>
                            </div>
                          </div>
                        ))}
                        {serviceRequests.length === 0 && (
                          <p className="text-sm text-gray-400 italic">No recent activity</p>
                        )}
                      </div>
                    </div>

                    {/* Floor Stats */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Floor Status</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#F9F9F9] p-4 rounded-xl">
                          <p className="text-2xl font-serif text-[#2C2C2C]">{tables.filter(t => t.status === 'occupied').length}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Active Tables</p>
                        </div>
                        <div className="bg-[#F9F9F9] p-4 rounded-xl">
                          <p className="text-2xl font-serif text-[#2C2C2C]">{tables.filter(t => t.status === 'available').length}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
