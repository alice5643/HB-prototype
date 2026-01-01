import { useStore, ServiceRequest } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Droplets, 
  Sandwich, 
  Snowflake, 
  Camera, 
  ChefHat, 
  Wine,
  AlertCircle,
  Check
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function StaffDashboard() {
  const serviceRequests = useStore((state) => state.serviceRequests);
  const updateServiceRequestStatus = useStore((state) => state.updateServiceRequestStatus);

  // Filter requests by status
  const pendingRequests = serviceRequests.filter(req => req.status === 'pending');
  const acknowledgedRequests = serviceRequests.filter(req => req.status === 'acknowledged');
  const completedRequests = serviceRequests.filter(req => req.status === 'completed').slice(0, 5); // Show last 5 completed

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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`
          p-4 rounded-xl border shadow-sm mb-3
          ${request.status === 'pending' 
            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
            : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'}
        `}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${request.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}
            `}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Table {request.tableNumber}</h3>
              <p className="text-sm font-medium opacity-80">{request.details}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium opacity-60">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(request.timestamp, { addSuffix: true })}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {request.status === 'pending' && (
            <button
              onClick={() => updateServiceRequestStatus(request.id, 'acknowledged')}
              className="flex-1 bg-white dark:bg-gray-800 py-2 rounded-lg text-sm font-semibold shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors"
            >
              Acknowledge
            </button>
          )}
          
          <button
            onClick={() => updateServiceRequestStatus(request.id, 'completed')}
            className={`
              flex-1 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2
              ${request.status === 'pending' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'}
            `}
          >
            <Check className="w-4 h-4" />
            Mark Complete
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage incoming service requests</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="block text-xs text-gray-500 uppercase font-bold">Pending</span>
              <span className="text-2xl font-bold text-red-600">{pendingRequests.length}</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="block text-xs text-gray-500 uppercase font-bold">Active</span>
              <span className="text-2xl font-bold text-yellow-600">{acknowledgedRequests.length}</span>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Incoming Requests Column */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Incoming Requests
            </h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {pendingRequests.length === 0 && acknowledgedRequests.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700"
                  >
                    <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No active requests</p>
                  </motion.div>
                ) : (
                  <>
                    {pendingRequests.map(req => (
                      <RequestCard key={req.id} request={req} />
                    ))}
                    {acknowledgedRequests.map(req => (
                      <RequestCard key={req.id} request={req} />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Completed History Column */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Recently Completed
            </h2>
            <div className="space-y-2">
              <AnimatePresence>
                {completedRequests.map(req => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Table {req.tableNumber}</p>
                        <p className="text-xs text-gray-500">{req.details}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(req.timestamp, { addSuffix: true })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
