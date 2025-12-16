import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { menus, MenuSection, Dish } from "@/lib/data";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const [, params] = useRoute("/gallery/:type");
  const [, setLocation] = useLocation();
  
  const menuType = params?.type || "alacarte";
  const currentMenu = menus.find(m => m.id === menuType);
  const menuData = currentMenu?.data || [];
  
  // Flatten menu items for gallery view
  const allDishes = menuData.flatMap((section: MenuSection) => section.items);

  return (
    <Layout showHeader={false}>
      <div className="relative min-h-screen bg-stone-900 text-stone-50">
        {/* Floating Header */}
        <div className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent h-32 pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="font-serif text-2xl text-white drop-shadow-md">Gallery</h1>
            <p className="text-sm text-white/80 drop-shadow-md">Visual exploration</p>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setLocation(`/menu/${menuType}`)}
            className="pointer-events-auto rounded-full bg-black/20 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="flex flex-col gap-1 pb-24">
          {allDishes.map((dish: Dish, index: number) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5 }}
              onClick={() => setLocation(`/dish/${dish.id}`)}
              className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer group"
            >
              <img 
                src={dish.image || "/images/placeholder-dish.jpg"} 
                alt={dish.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-serif text-2xl text-white mb-1">{dish.name}</h3>
                <p className="text-sm text-white/70 line-clamp-1">{dish.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Floating Action Button to return to text menu */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <Button 
            onClick={() => setLocation(`/menu/${menuType}`)}
            className="pointer-events-auto shadow-lg bg-white text-black hover:bg-stone-200 rounded-full px-6 py-6 font-serif text-lg"
          >
            Back to Text Menu
          </Button>
        </div>
      </div>
    </Layout>
  );
}
