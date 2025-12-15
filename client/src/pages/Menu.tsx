import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import Layout from "@/components/Layout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Import menuData from data file if not in store
import { menuData as staticMenuData } from "@/lib/data";

export default function Menu() {
  const [, setLocation] = useLocation();
  const [showPhotos, setShowPhotos] = useState(false);
  
  // Effect to handle toggle switch
  useEffect(() => {
    if (showPhotos) {
      setLocation("/gallery");
    }
  }, [showPhotos, setLocation]);

  return (
    <Layout title="Menu">
      <div className="pb-24">
        {/* View Toggle */}
        <div className="container py-6 flex justify-end">
          <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Label htmlFor="photo-mode" className="text-xs font-medium cursor-pointer">View with photos</Label>
            <Switch 
              id="photo-mode" 
              checked={showPhotos}
              onCheckedChange={setShowPhotos}
              className="scale-75 data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-12 container">
          {staticMenuData.map((section, index) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="space-y-6"
            >
              <div className="space-y-2 sticky top-16 bg-background/95 backdrop-blur-sm py-4 z-30 border-b border-border/20">
                <h2 className="text-3xl font-serif text-primary">{section.title}</h2>
                {section.description && (
                  <p className="text-muted-foreground font-serif italic">{section.description}</p>
                )}
              </div>

              <div className="space-y-8">
                {section.items.map((dish) => (
                  <div 
                    key={dish.id}
                    onClick={() => setLocation(`/dish/${dish.id}`)}
                    className="group cursor-pointer space-y-2 active:opacity-70 transition-opacity"
                  >
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xl font-medium group-hover:text-primary transition-colors">{dish.name}</h3>
                      <span className="text-sm font-mono text-muted-foreground">£{dish.price}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pr-8">{dish.description}</p>
                    <div className="flex gap-2 pt-1">
                      {dish.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider text-muted-foreground/70 border border-border px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
        
        {/* Bottom spacer */}
        <div className="h-12" />
      </div>
    </Layout>
  );
}
