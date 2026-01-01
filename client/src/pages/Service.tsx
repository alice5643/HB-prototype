import { useLocation } from "wouter";
import { 
  Droplets, 
  Utensils, 
  Camera, 
  ChefHat, 
  Wine, 
  Snowflake, 
  Sandwich,
  Home,
  BookOpen,
  ConciergeBell,
  Utensils as UtensilsIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useStore, ServiceRequestType } from "@/lib/store";
import { toast } from "sonner";

export default function Service() {
  const [, setLocation] = useLocation();
  const addServiceRequest = useStore((state) => state.addServiceRequest);

  const services: { id: string; label: string; icon: any; type: ServiceRequestType }[] = [
    { id: "water", label: "Water Refill", icon: Droplets, type: "refill" },
    { id: "bread", label: "More Bread", icon: Sandwich, type: "side" },
    { id: "condiments", label: "Condiments", icon: Utensils, type: "condiment" },
    { id: "cutlery", label: "New Cutlery", icon: UtensilsIcon, type: "cutlery" },
    { id: "ice", label: "Ice Bucket", icon: Snowflake, type: "custom" },
    { id: "photo", label: "Photo Assist", icon: Camera, type: "custom" },
    { id: "chef", label: "Consult Chef", icon: ChefHat, type: "custom" },
    { id: "sommelier", label: "Sommelier", icon: Wine, type: "custom" },
  ];

  const handleRequest = (service: typeof services[0]) => {
    addServiceRequest(service.type, service.label);
    toast.success(`${service.label} request sent`, {
      description: "A staff member will be with you shortly."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Top Navigation */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border/50 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setLocation("/dashboard")}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setLocation("/menus")}
          >
            <BookOpen className="w-4 h-4" />
            Menu
          </button>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-primary transition-colors"
          >
            <ConciergeBell className="w-4 h-4" />
            Service
          </button>
        </div>
        
        <button 
          className="relative p-2 hover:bg-secondary rounded-full transition-colors"
          onClick={() => setLocation("/dining-status")}
        >
          <UtensilsIcon className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="text-center mb-8 mt-4">
          <h1 className="font-serif text-2xl text-primary mb-2">How can we help?</h1>
          <p className="text-sm text-muted-foreground">Select a service below</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border/50 rounded-xl hover:border-primary hover:bg-primary/5 transition-all shadow-sm aspect-square"
              onClick={() => handleRequest(service)}
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary">
                <service.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-foreground">{service.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
