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
  MoreHorizontal
} from 'lucide-react';

// Mock Tables Data with positions for the floor plan
const TABLES = [
  { id: '1', name: 'T1', seats: 2, x: 100, y: 100, status: 'occupied' },
  { id: '2', name: 'T2', seats: 2, x: 100, y: 250, status: 'available' },
  { id: '3', name: 'T3', seats: 4, x: 300, y: 100, status: 'occupied' },
  { id: '4', name: 'T4', seats: 4, x: 300, y: 250, status: 'reserved' },
  { id: '5', name: 'T5', seats: 6, x: 550, y: 180, status: 'occupied' },
  { id: '6', name: 'T6', seats: 2, x: 800, y: 100, status: 'available' },
  { id: '7', name: 'T7', seats: 4, x: 800, y: 250, status: 'occupied' },
  { id: '8', name: 'T8', seats: 8, x: 550, y: 400, status: 'reserved' },
  { id: '12', name: 'T12', seats: 4, x: 300, y: 400, status: 'occupied' }, // The user's table
];

export default function StaffDashboard() {
  const { serviceRequests, updateServiceRequestStatus, orders, toggleOrderServed, sharingModel, partySize } = useStore();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
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
    ? serviceRequests.filter(r => r.tableNumber === TABLES.find(t => t.id === selectedTableId)?.name.replace('T', ''))
    : [];

  const activeRequests = tableRequests.filter(r => r.status !== 'completed');
  const completedRequests = tableRequests.filter(r => r.status === 'completed');

  // Filter orders for the selected table
  const tableOrders = selectedTableId
    ? orders // In a real app, we would filter by tableId here. For demo, we assume all orders are for the current user (T12)
    : [];
    
  const activeOrders = tableOrders.filter(o => !o.served);
  const servedOrders = tableOrders.filter(o => o.served);

  // Calculate Bill Total
  const billTotal = tableOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Get requests for a specific table to show indicators
  const getTableRequests = (tableId: string) => {
    const tableName = TABLES.find(t => t.id === tableId)?.name.replace('T', '');
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
            <button className="p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors">
              <Users className="w-5 h-5 text-[#5C4033]" />
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
              className="absolute top-0 left-0 w-[1000px] h-[1000px] origin-top-left"
              style={{ x: pan.x, y: pan.y, scale: scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {TABLES.map((table) => {
                const requests = getTableRequests(table.id);
                const hasRequests = requests.length > 0;
                const isSelected = selectedTableId === table.id;

                return (
                  <motion.div
                    key={table.id}
                    className={`absolute rounded-2xl border-2 flex flex-col items-center justify-center shadow-md cursor-pointer transition-all duration-300
                      ${isSelected 
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-white scale-110 z-10' 
                        : hasRequests
                          ? 'bg-white border-[#D4AF37] animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                          : 'bg-white border-[#E5E5E5] hover:border-[#D4AF37]/50'
                      }
                    `}
                    style={{
                      left: table.x,
                      top: table.y,
                      width: table.seats > 4 ? 160 : 100,
                      height: 100,
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent drag start
                      setSelectedTableId(table.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`font-serif text-lg font-bold ${isSelected ? 'text-white' : 'text-[#2C2C2C]'}`}>
                      {table.name}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className={`w-3 h-3 ${isSelected ? 'text-white/80' : 'text-gray-400'}`} />
                      <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {table.seats}
                      </span>
                    </div>

                    {/* Request Badge */}
                    {hasRequests && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm border border-white">
                        {requests.length}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Floor Plan Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-[#D4AF37]/20 shadow-sm pointer-events-none">
              <h3 className="font-serif text-[#2C2C2C] text-sm font-bold mb-2">Floor Plan</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white border border-[#D4AF37]" />
                  <span className="text-xs text-[#5C4033]">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                  <span className="text-xs text-[#5C4033]">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white border border-red-500" />
                  <span className="text-xs text-[#5C4033]">Request</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Panel (Static on Desktop, Slide-over on Mobile) */}
          <AnimatePresence mode="wait">
            {(selectedTableId || window.innerWidth >= 768) && (
              <motion.div 
                className={`
                  absolute md:relative inset-y-0 right-0 w-full md:w-[350px] bg-white border-l border-[#D4AF37]/20 shadow-xl md:shadow-none z-20 flex flex-col
                  ${!selectedTableId && window.innerWidth < 768 ? 'translate-x-full' : 'translate-x-0'}
                `}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {selectedTableId ? (
                  <>
                    {/* Panel Header */}
                    <div className="p-6 border-b border-[#F5F2EA] bg-[#FFFBF0]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="font-serif text-2xl text-[#2C2C2C]">Table {TABLES.find(t => t.id === selectedTableId)?.name}</h2>
                          <p className="text-[#8B4513] text-sm">Main Dining Room • {TABLES.find(t => t.id === selectedTableId)?.seats} Guests</p>
                        </div>
                        <button 
                          onClick={() => setSelectedTableId(null)}
                          className="md:hidden p-2 hover:bg-black/5 rounded-full"
                        >
                          <X className="w-5 h-5 text-[#5C4033]" />
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white border border-[#D4AF37]/20 rounded-lg p-2 text-center">
                          <span className="block text-xs text-[#8B4513] uppercase tracking-wider mb-1">Course</span>
                          <span className="font-serif text-[#2C2C2C] font-medium">Main</span>
                        </div>
                        <div className="flex-1 bg-white border border-[#D4AF37]/20 rounded-lg p-2 text-center">
                          <span className="block text-xs text-[#8B4513] uppercase tracking-wider mb-1">Time</span>
                          <span className="font-serif text-[#2C2C2C] font-medium">45m</span>
                        </div>
                      </div>
                    </div>

                    {/* Requests & Orders List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FAFAFA]">
                      
                      {/* Active Requests Section */}
                      {activeRequests.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider ml-1">Active Requests</h3>
                          {activeRequests.map((req) => (
                            <motion.div 
                              key={req.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  {/* @ts-ignore - Types are compatible but TS is strict about string literals */}
                                  {req.type === 'water' && <GlassWater className="w-4 h-4 text-[#5C4033]" />}
                                  {req.type === 'cutlery' && <Utensils className="w-4 h-4 text-[#5C4033]" />}
                                  {/* @ts-ignore - Types are compatible but TS is strict about string literals */}
                                  {req.type === 'service' && <ChefHat className="w-4 h-4 text-[#5C4033]" />}
                                  <span className="font-medium text-[#2C2C2C]">{req.details || req.type}</span>
                                </div>
                                <span className="text-xs text-gray-400 font-mono">
                                  {format(new Date(req.timestamp), 'HH:mm')}
                                </span>
                              </div>
                              
                              <div className="flex gap-2">
                                {req.status === 'pending' && (
                                  <button 
                                    onClick={() => updateServiceRequestStatus(req.id, 'acknowledged')}
                                    className="flex-1 bg-[#FFFBF0] text-[#8B4513] border border-[#D4AF37]/30 py-2 rounded-lg text-sm font-medium hover:bg-[#F5F2EA] transition-colors"
                                  >
                                    Acknowledge
                                  </button>
                                )}
                                <button 
                                  onClick={() => updateServiceRequestStatus(req.id, 'completed')}
                                  className="flex-1 bg-[#2C2C2C] text-[#F5F2EA] py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                                >
                                  Complete
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Live Orders Section */}
                      {selectedTableId === '12' && (activeOrders.length > 0 || servedOrders.length > 0) && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider flex items-center gap-2">
                            <Utensils className="w-3 h-3" />
                            Live Orders
                          </h3>
                          
                          {/* Active Orders */}
                          {activeOrders.map(order => (
                            <div key={`${order.id}-${order.selectedVariationId}`} className="bg-white rounded-xl p-3 border border-[#E5E5E5] shadow-sm flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-serif font-medium text-[#2C2C2C]">{order.name}</span>
                                  <span className="text-xs bg-[#F5F2EA] text-[#8B4513] px-1.5 py-0.5 rounded">x{order.quantity}</span>
                                </div>
                                {order.selectedVariationName && (
                                  <p className="text-xs text-gray-500">{order.selectedVariationName}</p>
                                )}
                              </div>
                              <button 
                                onClick={() => toggleOrderServed(order.id, order.selectedVariationId)}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}

                          {/* Served Orders (Collapsed/Dimmed) */}
                          {servedOrders.length > 0 && (
                            <div className="pt-2 space-y-2">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Served</p>
                              {servedOrders.map(order => (
                                <div key={`${order.id}-${order.selectedVariationId}`} className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex justify-between items-center opacity-60">
                                  <span className="text-sm text-gray-600 line-through">{order.name} (x{order.quantity})</span>
                                  <button 
                                    onClick={() => toggleOrderServed(order.id, order.selectedVariationId)}
                                    className="text-green-600"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bill Status Section */}
                      {selectedTableId === '12' && billTotal > 0 && (
                        <div className="mt-6 bg-[#FFFBF0] rounded-xl p-4 border border-[#D4AF37]/20">
                          <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mb-3">Bill Status</h3>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[#5C4033]">Total</span>
                            <span className="font-serif font-bold text-lg text-[#2C2C2C]">£{billTotal.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-sm text-[#5C4033]">Split Type</span>
                             <span className="text-sm font-medium text-[#2C2C2C] capitalize">
                               {sharingModel === 'separate' ? `Split (${partySize} ways)` : (sharingModel || 'Standard')}
                             </span>
                          </div>

                          {sharingModel === 'separate' && partySize && (
                            <div className="flex justify-between items-center mb-2 pl-2 border-l-2 border-[#D4AF37]/20">
                              <span className="text-xs text-[#5C4033]">Per Person</span>
                              <span className="text-sm font-medium text-[#2C2C2C]">£{(billTotal / partySize).toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#D4AF37]/10">
                            <span className="text-sm text-[#5C4033]">Payment Status</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Open</span>
                          </div>
                        </div>
                      )}

                      {/* Completed History */}
                      {completedRequests.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">History</h3>
                          {completedRequests.map((req) => (
                            <div key={req.id} className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center opacity-60">
                              <span className="text-sm text-gray-600 line-through">{req.details || req.type}</span>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Empty State */}
                      {activeRequests.length === 0 && activeOrders.length === 0 && servedOrders.length === 0 && completedRequests.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                          <div className="w-16 h-16 rounded-full bg-[#F5F2EA] flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                          </div>
                          <p className="font-serif text-[#2C2C2C] text-lg">All Clear</p>
                          <p className="text-sm text-[#5C4033]">No active requests or orders.</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* Empty State for Desktop Panel */
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#FAFAFA]">
                    <div className="w-20 h-20 rounded-full bg-[#FFFBF0] flex items-center justify-center mb-6 border border-[#D4AF37]/20">
                      <MapPin className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h2 className="font-serif text-2xl text-[#2C2C2C] mb-2">Select a Table</h2>
                    <p className="text-[#5C4033] max-w-[200px]">
                      Tap on any table in the floor plan to view details and manage requests.
                    </p>
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
