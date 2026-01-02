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
  ChevronRight,
  LayoutGrid,
  List
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function StaffDashboard() {
  const serviceRequests = useStore((state) => state.serviceRequests);
  const updateServiceRequestStatus = useStore((state) => state.updateServiceRequestStatus);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor');

  // Mock tables data
  const tables = [
    { id: "1", seats: 2, x: 10, y: 10 },
    { id: "2", seats: 2, x: 10, y: 40 },
    { id: "3", seats: 4, x: 35, y: 10 },
    { id: "4", seats: 4, x: 35, y: 40 },
    { id: "5", seats: 6, x: 60, y: 25 },
    { id: "12", seats: 4, x: 85, y: 10 }, // Demo table
  ];

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
    <div className="min-h-screen bg-[#F5F2EA] flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#FFFBF0] border-b border-[#D4AF37]/20 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-serif text-xl text-[#2C2C2C]">Savoy Staff</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('floor')}
            className={`p-2 rounded-lg ${viewMode === 'floor' ? 'bg-[#D4AF37] text-white' : 'bg-white text-[#2C2C2C]'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#D4AF37] text-white' : 'bg-white text-[#2C2C2C]'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Left Panel: Floor Plan */}
      <div className={`
        flex-1 p-6 md:p-8 overflow-y-auto transition-all duration-300
        ${viewMode === 'list' ? 'hidden md:block' : 'block'}
      `}>
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          <div className="hidden md:flex justify-between items-center mb-8">
            <div>
              <h1 className="font-serif text-3xl text-[#2C2C2C] mb-1">Floor Plan</h1>
              <p className="text-[#5C5C5C]">Main Dining Room</p>
            </div>
            <div className="flex gap-4 text-sm">
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

          {/* Floor Map Container */}
          <div className="flex-1 bg-[#FFFBF0] rounded-2xl border border-[#D4AF37]/20 shadow-sm relative min-h-[500px] p-8">
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
            
            {tables.map((table) => {
              const status = getTableStatus(table.id);
              const isSelected = selectedTable === table.id;
              
              return (
                <motion.button
                  key={table.id}
                  layoutId={`table-${table.id}`}
                  onClick={() => {
                    setSelectedTable(table.id);
                    if (window.innerWidth < 768) setViewMode('list');
                  }}
                  className={`
                    absolute rounded-xl flex flex-col items-center justify-center transition-all duration-300
                    ${status === 'pending' ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20 z-10' : ''}
                    ${status === 'active' ? 'bg-[#E6D5A9] text-[#2C2C2C] border border-[#D4AF37]' : ''}
                    ${status === 'idle' ? 'bg-white text-[#2C2C2C] border border-[#D4AF37]/20 hover:border-[#D4AF37]' : ''}
                    ${isSelected ? 'ring-4 ring-[#D4AF37]/20 scale-105' : ''}
                  `}
                  style={{
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    width: '120px',
                    height: '120px',
                  }}
                  animate={status === 'pending' ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(212, 175, 55, 0.4)",
                      "0 0 0 10px rgba(212, 175, 55, 0)",
                      "0 0 0 0 rgba(212, 175, 55, 0)"
                    ]
                  } : {}}
                  transition={status === 'pending' ? {
                    duration: 2,
                    repeat: Infinity
                  } : {}}
                >
                  <span className="font-serif text-2xl font-bold mb-1">T{table.id}</span>
                  <div className="flex items-center gap-1 text-xs opacity-80">
                    <Users className="w-3 h-3" />
                    <span>{table.seats}</span>
                  </div>
                  
                  {status !== 'idle' && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#FFFBF0]">
                      {getTableRequests(table.id).length}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel: Action Sidebar */}
      <div className={`
        w-full md:w-[400px] bg-white border-l border-[#D4AF37]/20 flex flex-col shadow-xl z-10
        ${viewMode === 'list' ? 'block' : 'hidden md:flex'}
      `}>
        {selectedTable ? (
          <>
            <div className="p-6 border-b border-[#D4AF37]/10 bg-[#FFFBF0]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#2C2C2C]">Table {selectedTable}</h2>
                  <p className="text-[#5C5C5C] text-sm">Window Seat • 4 Guests</p>
                </div>
                <button 
                  onClick={() => setSelectedTable(null)}
                  className="text-[#D4AF37] hover:text-[#B48F17] md:hidden"
                >
                  Close
                </button>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-white p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                  <span className="block text-xs text-[#8C8C8C] uppercase tracking-wider mb-1">Course</span>
                  <span className="font-serif text-lg text-[#2C2C2C]">Mains</span>
                </div>
                <div className="flex-1 bg-white p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                  <span className="block text-xs text-[#8C8C8C] uppercase tracking-wider mb-1">Wait Time</span>
                  <span className="font-serif text-lg text-[#2C2C2C]">12m</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#FAFAFA]">
              <h3 className="font-serif text-lg text-[#2C2C2C] mb-4 flex items-center gap-2">
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
                    <p>All caught up!</p>
                    <p className="text-sm opacity-60">No active requests for this table.</p>
                  </motion.div>
                ) : (
                  getTableRequests(selectedTable).map(req => (
                    <RequestCard key={req.id} request={req} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8C8C8C]">
            <div className="w-20 h-20 rounded-full bg-[#FFFBF0] flex items-center justify-center mb-4 border border-[#D4AF37]/20">
              <LayoutGrid className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-xl text-[#2C2C2C] mb-2">Select a Table</h3>
            <p className="max-w-[200px]">Tap on any table in the floor plan to view details and manage requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
