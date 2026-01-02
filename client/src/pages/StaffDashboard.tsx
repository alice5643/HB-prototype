import { useStore, ServiceRequest } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Droplets, 
  Sandwich, 
  AlertCircle,
  Check,
  Users,
  LayoutGrid,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, useEffect } from "react";

export default function StaffDashboard() {
  const serviceRequests = useStore((state) => state.serviceRequests);
  const updateServiceRequestStatus = useStore((state) => state.updateServiceRequestStatus);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mock tables data
  const tables = [
    { id: "1", seats: 2, x: 10, y: 10 },
    { id: "2", seats: 2, x: 10, y: 40 },
    { id: "3", seats: 4, x: 35, y: 10 },
    { id: "4", seats: 4, x: 35, y: 40 },
    { id: "5", seats: 6, x: 60, y: 25 },
    { id: "12", seats: 4, x: 85, y: 10 }, // Demo table
  ];

  // Center the map on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      scrollContainerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  // Get requests for a specific table
  const getTableRequests = (tableId: string) => {
    return serviceRequests.filter(req => req.tableNumber === tableId && req.status !== 'completed');
  };

  // Get status color for table
  const getTableStatus = (tableId: string) => {
    const requests = getTableRequests(tableId);
    if (requests.some(r => r.status === 'pending')) return 'pending';
    if (requests.some(r => r.status === 'acknowledged')) return 'active';
    return 'idle';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'refill': return Droplets;
      case 'side': return Sandwich;
      case 'condiment': return Utensils;
      case 'cutlery': return Utensils;
      case 'custom': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const RequestCard = ({ request }: { request: ServiceRequest }) => {
    const Icon = getIcon(request.type);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          p-4 rounded-xl border shadow-sm mb-3 relative overflow-hidden
          ${request.status === 'pending' 
            ? 'bg-[#FFFBF0] border-[#D4AF37]/30' 
            : 'bg-white border-gray-200'}
        `}
      >
        {/* Gold accent line for pending */}
        {request.status === 'pending' && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]" />
        )}

        <div className="flex justify-between items-start mb-3 pl-2">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border
              ${request.status === 'pending' 
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20' 
                : 'bg-gray-100 text-gray-500 border-gray-200'}
            `}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">
                {request.type === 'custom' ? 'Custom Request' : request.details}
              </h3>
              <p className="text-sm text-[#5C5C5C]">{request.details}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-[#8C8C8C]">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(request.timestamp, { addSuffix: true })}
          </div>
        </div>

        <div className="flex gap-2 mt-2 pl-2">
          {request.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateServiceRequestStatus(request.id, 'acknowledged');
              }}
              className="flex-1 bg-white py-2 rounded-lg text-sm font-serif text-[#2C2C2C] shadow-sm border border-[#D4AF37]/30 hover:bg-[#FFFBF0] transition-colors"
            >
              Acknowledge
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateServiceRequestStatus(request.id, 'completed');
            }}
            className={`
              flex-1 py-2 rounded-lg text-sm font-serif shadow-sm transition-colors flex items-center justify-center gap-2
              ${request.status === 'pending' 
                ? 'bg-[#D4AF37] text-white hover:bg-[#C49F27]' 
                : 'bg-[#2C2C2C] text-white hover:bg-black'}
            `}
          >
            <Check className="w-4 h-4" />
            Complete
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="staff-dashboard-wrapper min-h-screen bg-[#2C2C2C] flex items-center justify-center p-0 md:p-8 overflow-hidden">
      {/* Tablet Container */}
      <div className="w-full h-full md:w-[1024px] md:h-[768px] bg-[#F5F2EA] md:rounded-[32px] md:shadow-2xl overflow-hidden flex flex-col relative md:border-[12px] md:border-[#1a1a1a]">
        
        {/* Header */}
        <div className="bg-[#FFFBF0] border-b border-[#D4AF37]/20 p-4 flex justify-between items-center z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-serif font-bold text-xl">S</div>
            <div>
              <h1 className="font-serif text-xl text-[#2C2C2C] leading-none">Savoy Staff</h1>
              <p className="text-xs text-[#8C8C8C] mt-1">Main Dining Room</p>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm hidden md:flex">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>Request Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E6D5A9]" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white border border-[#D4AF37]/30" />
              <span>Idle</span>
            </div>
          </div>
        </div>

        {/* Main Content Area - Split View */}
        <div className="flex-1 flex relative overflow-hidden">
          
          {/* Left Panel: Floor Plan (Pannable) */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-auto bg-[#EAE7DE] relative cursor-grab active:cursor-grabbing"
            style={{ 
              backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', 
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0',
              opacity: 0.8
            }}
          >
            {/* Map Container - Larger than viewport to allow panning */}
            <div className="min-w-[800px] min-h-[600px] w-full h-full relative p-12">
              {tables.map((table) => {
                const status = getTableStatus(table.id);
                const isSelected = selectedTable === table.id;
                
                return (
                  <motion.button
                    key={table.id}
                    layoutId={`table-${table.id}`}
                    onClick={() => setSelectedTable(table.id)}
                    className={`
                      absolute rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-md
                      ${status === 'pending' ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/40 z-10' : ''}
                      ${status === 'active' ? 'bg-[#E6D5A9] text-[#2C2C2C] border-2 border-[#D4AF37]' : ''}
                      ${status === 'idle' ? 'bg-white text-[#2C2C2C] border border-[#D4AF37]/20 hover:border-[#D4AF37]' : ''}
                      ${isSelected ? 'ring-4 ring-[#D4AF37]/30 scale-110 z-20' : ''}
                    `}
                    style={{
                      left: `${table.x}%`,
                      top: `${table.y}%`,
                      width: '140px',
                      height: '140px',
                      transform: 'translate(-50%, -50%)' // Center anchor point
                    }}
                    animate={status === 'pending' ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 10px 15px -3px rgba(212, 175, 55, 0.4)",
                        "0 0 0 12px rgba(212, 175, 55, 0)",
                        "0 10px 15px -3px rgba(212, 175, 55, 0)"
                      ]
                    } : {}}
                    transition={status === 'pending' ? {
                      duration: 2,
                      repeat: Infinity
                    } : {}}
                  >
                    <span className="font-serif text-3xl font-bold mb-1">T{table.id}</span>
                    <div className="flex items-center gap-1 text-xs opacity-80 font-medium uppercase tracking-wider">
                      <Users className="w-3 h-3" />
                      <span>{table.seats} Seats</span>
                    </div>
                    
                    {status !== 'idle' && (
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#EAE7DE] shadow-sm">
                        {getTableRequests(table.id).length}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Action Sidebar (Desktop: Fixed, Mobile: Slide-over) */}
          <AnimatePresence>
            {selectedTable && (
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute md:relative right-0 top-0 bottom-0 w-full md:w-[380px] bg-white border-l border-[#D4AF37]/20 shadow-2xl z-30 flex flex-col"
              >
                <div className="p-6 border-b border-[#D4AF37]/10 bg-[#FFFBF0] flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-3xl text-[#2C2C2C] mb-1">Table {selectedTable}</h2>
                    <p className="text-[#5C5C5C] text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Occupied • 45 mins
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedTable(null)}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-[#8C8C8C]" />
                  </button>
                </div>

                <div className="p-4 grid grid-cols-2 gap-3 bg-[#FAFAFA] border-b border-gray-100">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="block text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold mb-1">Current Course</span>
                    <span className="font-serif text-lg text-[#2C2C2C]">Mains</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="block text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold mb-1">Total Bill</span>
                    <span className="font-serif text-lg text-[#2C2C2C]">£142.50</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-[#FAFAFA]">
                  <h3 className="font-serif text-lg text-[#2C2C2C] mb-4 flex items-center gap-2 px-1">
                    <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
                    Active Requests
                  </h3>
                  
                  <AnimatePresence mode="popLayout">
                    {getTableRequests(selectedTable).length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-[#8C8C8C]"
                      >
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">All caught up!</p>
                        <p className="text-sm opacity-60 mt-1">No active requests for this table.</p>
                      </motion.div>
                    ) : (
                      getTableRequests(selectedTable).map(req => (
                        <RequestCard key={req.id} request={req} />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State for Desktop Sidebar */}
          <div className="hidden md:flex w-[380px] bg-white border-l border-[#D4AF37]/20 flex-col items-center justify-center p-8 text-center text-[#8C8C8C]">
            {!selectedTable && (
              <>
                <div className="w-24 h-24 rounded-full bg-[#FFFBF0] flex items-center justify-center mb-6 border border-[#D4AF37]/20">
                  <LayoutGrid className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-2xl text-[#2C2C2C] mb-3">Select a Table</h3>
                <p className="max-w-[240px] leading-relaxed">Tap on any table in the floor plan to view details and manage requests.</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
