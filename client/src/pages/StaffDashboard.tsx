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
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const { serviceRequests, updateServiceRequestStatus, orders, toggleOrderServed, sharingModel, partySize, tables, updateTableStatus, joinTables, splitTable, resetTables, simulateRequest } = useStore();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false); // State for join mode
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Map Panning & Zooming State
  const mapRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
            ref={mapRef}
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
              className="absolute top-0 left-0 w-[1500px] h-[1000px] origin-top-left"
              style={{ x: pan.x, y: pan.y, scale: scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {tables.filter(t => t.status !== 'hidden').map((table) => {
                const requests = getTableRequests(table.id);
                const hasRequests = requests.length > 0;
                const isSelected = selectedTableId === table.id;
                
                // Determine style based on status
                let statusStyles = 'bg-white border-[#E5E5E5] hover:border-[#D4AF37]/50';
                if (table.status === 'occupied') statusStyles = 'bg-white border-[#2C2C2C] border-2';
                if (table.status === 'reserved') statusStyles = 'bg-[#F5F2EA] border-dashed border-[#8B4513]/30';
                if (table.status === 'cleaning') statusStyles = 'bg-gray-100 border-gray-200 opacity-70';
                
                if (hasRequests) statusStyles = 'bg-white border-[#D4AF37] animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.5)]';
                if (isSelected) statusStyles = 'bg-[#D4AF37] border-[#D4AF37] text-white scale-110 z-10 shadow-xl';

                return (
                  <motion.div
                    key={table.id}
                    className={cn(
                      "absolute flex items-center justify-center transition-all duration-300 cursor-pointer",
                      isSelected ? "z-10 scale-110" : "hover:scale-105"
                    )}
                    style={{
                      left: table.x,
                      top: table.y,
                      width: table.name.startsWith('B') ? 60 : (table.seats > 4 ? 160 : 100),
                      height: table.name.startsWith('B') ? 60 : 100,
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent drag start
                      if (isJoining && selectedTableId && selectedTableId !== table.id) {
                        // Join logic: Join selected table INTO the clicked table
                        // We keep the clicked table as the new "master" (target)
                        joinTables(selectedTableId, table.id);
                        setSelectedTableId(table.id); // Select the new merged table
                        // Keep isJoining true to allow chaining more tables
                      } else {
                        setSelectedTableId(table.id);
                        // Only cancel join mode if we click the same table again to toggle off, or if we want to stop.
                        if (selectedTableId === table.id && isJoining) {
                           setIsJoining(false);
                        }
                      }
                    }}
                  >
                    {/* Table Shape */}
                    <div className={cn(
                      "w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center shadow-md relative",
                      statusStyles,
                      table.name.startsWith('B') && "rounded-full"
                    )}>
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
                      
                      {/* Timer for occupied tables */}
                      {table.status === 'occupied' && table.seatedTime && (
                        <div className={`text-[10px] font-medium mt-1 px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F5F2EA] text-[#8B4513]'}`}>
                          <TableTimer startTime={table.seatedTime} />
                        </div>
                      )}

                      {/* Request Indicator Badge */}
                      {hasRequests && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm animate-bounce">
                          {requests.length}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

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

          {/* Right: Action Panel (Slide-over on mobile, Static on desktop) */}
          <AnimatePresence>
            {(selectedTableId || !selectedTableId) && ( // Always show panel on desktop, conditionally on mobile
              <motion.div 
                className={`absolute md:relative right-0 top-0 bottom-0 w-full md:w-[400px] bg-white shadow-[-5px_0_20px_rgba(0,0,0,0.05)] z-20 flex flex-col border-l border-[#F0EAD6] ${!selectedTableId ? 'hidden md:flex' : 'flex'}`}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {selectedTable ? (
                  <>
                    {/* Panel Header */}
                    <div className="p-6 border-b border-[#F0EAD6] bg-[#FFFBF0]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="font-serif text-3xl text-[#2C2C2C]">{selectedTable.name}</h2>
                          <div className="flex items-center gap-2 mt-1 text-[#8B4513]">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">{selectedTable.seats} Guests</span>
                            <span className="text-[#D4AF37]">•</span>
                            <span className="text-sm font-medium capitalize">{selectedTable.status}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedTableId(null)}
                          className="md:hidden p-2 hover:bg-[#D4AF37]/10 rounded-full text-[#8B4513]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTable.status === 'available' && (
                          <button 
                            className="col-span-2 py-3 bg-[#2C2C2C] text-[#FFFBF0] rounded-xl font-medium hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
                            onClick={() => updateTableStatus(selectedTable.id, 'occupied')}
                          >
                            <Users className="w-4 h-4" />
                            Seat Guests
                          </button>
                        )}
                        {selectedTable.status === 'occupied' && (
                          <>
                            <button 
                              className="py-2 bg-[#FFFBF0] border border-[#D4AF37] text-[#8B4513] rounded-lg text-sm font-medium hover:bg-[#F5F2EA] transition-colors"
                              onClick={() => updateTableStatus(selectedTable.id, 'cleaning')}
                            >
                              Clear Table
                            </button>
                            <button 
                              className={`py-2 border rounded-lg text-sm font-medium transition-colors ${isJoining ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-white border-[#D4AF37] text-[#8B4513] hover:bg-[#F5F2EA]'}`}
                              onClick={() => setIsJoining(!isJoining)}
                            >
                              {isJoining ? 'Select Table to Join' : 'Join Tables'}
                            </button>
                          </>
                        )}
                        {selectedTable.mergedIds && selectedTable.mergedIds.length > 0 && (
                           <button 
                              className="col-span-2 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                              onClick={() => splitTable(selectedTable.id)}
                            >
                              Split Table
                            </button>
                        )}
                        {selectedTable.status === 'cleaning' && (
                          <button 
                            className="col-span-2 py-3 bg-[#D4AF37] text-white rounded-xl font-medium hover:bg-[#C4A030] transition-colors flex items-center justify-center gap-2"
                            onClick={() => updateTableStatus(selectedTable.id, 'available')}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Ready
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      
                      {/* Service Requests */}
                      {activeRequests.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Active Requests
                          </h3>
                          {activeRequests.map(req => (
                            <div key={req.id} className="bg-white border border-[#D4AF37]/30 rounded-xl p-4 shadow-sm flex justify-between items-center animate-in slide-in-from-right-4 duration-300">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FFFBF0] flex items-center justify-center text-[#D4AF37]">
                                  {req.type === 'bill' ? <span className="font-serif font-bold">£</span> : <Bell className="w-4 h-4" />}
                                </div>
                                <div>
                                  <p className="font-medium text-[#2C2C2C] capitalize">{req.type}</p>
                                  <p className="text-xs text-gray-500">{format(req.timestamp, 'HH:mm')}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => updateServiceRequestStatus(req.id, 'completed')}
                                className="px-3 py-1.5 bg-[#D4AF37] text-white text-xs font-bold rounded-lg hover:bg-[#C4A030] transition-colors"
                              >
                                Resolve
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Order Status */}
                      {tableOrders.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              Current Orders
                            </h3>
                            <span className="text-xs font-medium text-gray-500">
                              {servedOrders.length}/{tableOrders.length} Served
                            </span>
                          </div>

                          <div className="space-y-2">
                            {tableOrders.map((item, idx) => (
                              <div key={`${item.id}-${idx}`} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${item.served ? 'bg-green-500' : 'bg-orange-400'}`} />
                                  <div>
                                    <p className={`text-sm font-medium ${item.served ? 'text-gray-400 line-through' : 'text-[#2C2C2C]'}`}>
                                      {item.quantity}x {item.name}
                                    </p>
                                    {item.selectedVariationName && (
                                      <p className="text-xs text-gray-400">{item.selectedVariationName}</p>
                                    )}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => toggleOrderServed(item.id, item.selectedVariationId)}
                                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${item.served ? 'text-gray-400 hover:bg-gray-100' : 'text-[#D4AF37] hover:bg-[#FFFBF0]'}`}
                                >
                                  {item.served ? 'Undo' : 'Serve'}
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Bill Summary */}
                          <div className="pt-4 border-t border-dashed border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-500">Subtotal</span>
                              <span className="text-sm font-medium text-[#2C2C2C]">£{billTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Service (12.5%)</span>
                              <span className="text-sm font-medium text-[#2C2C2C]">£{(billTotal * 0.125).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                              <span className="font-serif font-bold text-[#2C2C2C]">Total</span>
                              <span className="font-serif font-bold text-[#D4AF37] text-lg">£{(billTotal * 1.125).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Empty State for Orders */}
                      {tableOrders.length === 0 && (
                        <div className="text-center py-8 bg-[#F9F9F9] rounded-xl border border-dashed border-gray-200">
                          <ChefHat className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">No active orders</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // Empty State / Dashboard Overview
                  <div className="flex-1 flex flex-col h-full bg-[#FFFBF0]">
                    <div className="p-6 border-b border-[#F0EAD6]">
                      <h2 className="font-serif text-2xl text-[#2C2C2C]">Shift Activity</h2>
                      <p className="text-sm text-gray-500 mt-1">Live updates from the floor</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                      {serviceRequests.length > 0 ? (
                        <div className="space-y-4">
                          {serviceRequests.map(req => (
                            <div key={req.id} className="flex gap-4 items-start p-4 bg-white rounded-xl border border-[#F0EAD6] shadow-sm">
                              <div className="w-10 h-10 rounded-full bg-[#FFFBF0] flex items-center justify-center shrink-0 text-[#D4AF37] font-serif font-bold">
                                {req.tableNumber}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-[#2C2C2C]">
                                    Table {req.tableNumber}
                                    <span className="font-normal text-gray-500 ml-2">requested {req.type}</span>
                                  </p>
                                  <span className="text-xs text-gray-400">{format(req.timestamp, 'HH:mm')}</span>
                                </div>
                                {req.details && (
                                  <p className="text-sm text-gray-500 mt-1 bg-[#F9F9F9] p-2 rounded-lg">"{req.details}"</p>
                                )}
                                {req.status !== 'completed' && (
                                  <button 
                                    onClick={() => {
                                      setSelectedTableId(tables.find(t => t.name === `T${req.tableNumber}`)?.id || null);
                                    }}
                                    className="mt-3 text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                                  >
                                    View Table <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                          <div className="w-16 h-16 rounded-full bg-[#F5F2EA] flex items-center justify-center mb-4">
                            <Bell className="w-6 h-6 text-[#D4AF37]" />
                          </div>
                          <p className="font-medium text-[#5C4033]">All Quiet</p>
                          <p className="text-sm mt-1">Waiting for service requests...</p>
                          <button 
                            onClick={simulateRequest}
                            className="mt-6 px-4 py-2 bg-white border border-[#D4AF37] text-[#8B4513] rounded-lg text-sm font-medium hover:bg-[#FFFBF0] transition-colors"
                          >
                            Simulate Activity
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
