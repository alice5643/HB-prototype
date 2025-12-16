import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { menus } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function MenuList() {
  const [, setLocation] = useLocation();

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-stone-400 blur-[60px]" />
        </div>

        <div className="z-10 w-full max-w-sm flex flex-col items-center text-center space-y-12">
          {/* Logo / Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-2"
          >
            <h1 className="text-6xl font-serif text-primary tracking-tight">Azay</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full space-y-6"
          >
            {menus.map((menu, index) => (
              <motion.button
                key={menu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => !menu.disabled && setLocation(`/menu/${menu.id}`)}
                disabled={menu.disabled}
                className={cn(
                  "w-full py-3 text-xl font-serif transition-all duration-300",
                  menu.disabled 
                    ? "text-muted-foreground/40 cursor-not-allowed" 
                    : "text-foreground hover:text-primary hover:scale-105 active:scale-95"
                )}
              >
                {menu.title}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
