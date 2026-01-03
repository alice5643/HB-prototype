import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { menus, MenuSection, Dish } from "@/lib/data";
import { useEffect } from "react";

// Types for the multi-step flow
type Step = 'constraints' | 'preferences' | 'loading' | 'results';

interface Preferences {
  allergies: string[];
  dietary: string[];
  spiceLevel: string;
  protein: string[];
  mood: string;
}

export default function Discovery() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>('constraints');
  const [preferences, setPreferences] = useState<Preferences>({
    allergies: [],
    dietary: [],
    spiceLevel: 'medium',
    protein: [],
    mood: 'adventurous'
  });

  // Step 1: Constraints Data
  const allergies = [
    { id: 'nuts', label: 'Nuts' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'gluten', label: 'Gluten' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'soy', label: 'Soy' }
  ];

  const dietary = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'halal', label: 'Halal' }
  ];

  // Step 2: Preferences Data
  const proteins = [
    { id: 'beef', label: 'Beef' },
    { id: 'poultry', label: 'Poultry' },
    { id: 'seafood', label: 'Seafood' },
    { id: 'lamb', label: 'Lamb' },
    { id: 'pork', label: 'Pork' },
    { id: 'plant', label: 'Plant-Based' }
  ];

  const spiceLevels = [
    { id: 'none', label: 'No Spice' },
    { id: 'mild', label: 'Mild' },
    { id: 'medium', label: 'Medium' },
    { id: 'hot', label: 'Hot' }
  ];

  const toggleSelection = (category: 'allergies' | 'dietary' | 'protein', id: string) => {
    setPreferences(prev => {
      const current = prev[category];
      const updated = current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [category]: updated };
    });
  };

  const handleNext = () => {
    if (step === 'constraints') setStep('preferences');
    else if (step === 'preferences') {
      setStep('loading');
      // Simulate AI processing time
      setTimeout(() => {
        setStep('results');
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step === 'constraints') setLocation('/dashboard');
    else if (step === 'preferences') setStep('constraints');
    else if (step === 'results') setStep('preferences');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'url("/images/paper-texture.jpg")', backgroundSize: 'cover' }} />

      {/* Header */}
      <div className="relative z-10 px-6 py-6 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="flex gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${step === 'constraints' ? 'bg-primary' : 'bg-primary/20'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${step === 'preferences' ? 'bg-primary' : 'bg-primary/20'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${step === 'results' ? 'bg-primary' : 'bg-primary/20'}`} />
        </div>
        
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative z-10 flex flex-col px-6 pb-24">
        <AnimatePresence mode="wait">
          {step === 'constraints' && (
            <motion.div
              key="constraints"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-8">
                <h1 className="font-serif text-3xl text-foreground mb-3">First, any constraints?</h1>
                <p className="text-muted-foreground">Help us curate a safe and delightful menu for you.</p>
              </div>

              <div className="space-y-8">
                {/* Allergies Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Allergies</h3>
                  <div className="flex flex-wrap gap-3">
                    {allergies.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleSelection('allergies', item.id)}
                        className={`
                          px-4 py-2.5 rounded-full border transition-all duration-300 flex items-center gap-2
                          ${preferences.allergies.includes(item.id)
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-background border-border text-foreground hover:border-primary/50'}
                        `}
                      >
                        {item.label}
                        {preferences.allergies.includes(item.id) && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Dietary Preferences</h3>
                  <div className="flex flex-wrap gap-3">
                    {dietary.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleSelection('dietary', item.id)}
                        className={`
                          px-4 py-2.5 rounded-full border transition-all duration-300 flex items-center gap-2
                          ${preferences.dietary.includes(item.id)
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-background border-border text-foreground hover:border-primary/50'}
                        `}
                      >
                        {item.label}
                        {preferences.dietary.includes(item.id) && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-8">
                <h1 className="font-serif text-3xl text-foreground mb-3">Now, what are you craving?</h1>
                <p className="text-muted-foreground">Tell us about your taste preferences for tonight.</p>
              </div>

              <div className="space-y-8">
                {/* Protein Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Preferred Proteins</h3>
                  <div className="flex flex-wrap gap-3">
                    {proteins.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleSelection('protein', item.id)}
                        className={`
                          px-4 py-2.5 rounded-full border transition-all duration-300 flex items-center gap-2
                          ${preferences.protein.includes(item.id)
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-background border-border text-foreground hover:border-primary/50'}
                        `}
                      >
                        {item.label}
                        {preferences.protein.includes(item.id) && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spice Level Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Spice Tolerance</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {spiceLevels.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setPreferences(prev => ({ ...prev, spiceLevel: item.id }))}
                        className={`
                          py-2.5 rounded-lg border transition-all duration-300 text-sm font-medium
                          ${preferences.spiceLevel === item.id
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-background border-border text-foreground hover:border-primary/50'}
                        `}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-6"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <Sparkles className="w-16 h-16 text-primary" />
              </motion.div>
              <h2 className="font-serif text-2xl text-foreground mb-2">Curating your menu...</h2>
              <p className="text-muted-foreground">Analyzing flavors, textures, and pairings.</p>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-6">
                <h1 className="font-serif text-3xl text-foreground mb-2">Perfect Matches</h1>
                <p className="text-muted-foreground">Based on your taste profile.</p>
              </div>

              <div className="space-y-6 overflow-y-auto pb-24 -mx-6 px-6">
                {/* Mock Recommendations Logic */}
                {menus
                  .flatMap(m => m.data || [])
                  .flatMap(s => s.items)
                  .filter(d => {
                    // Simple filtering logic for demo
                    if (preferences.dietary.includes('vegetarian') && !d.tags?.includes('Vegetarian')) return false;
                    if (preferences.dietary.includes('vegan') && !d.tags?.includes('Vegan')) return false;
                    return true;
                  })
                  .slice(0, 3) // Take top 3 matches
                  .map((dish, index) => (
                    <motion.div
                      key={dish.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm group"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={dish.image || "/images/placeholder-dish.jpg"} 
                          alt={dish.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-foreground shadow-sm">
                            {index === 0 ? 'Top Match' : 'Recommended'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-lg font-medium">{dish.name}</h3>
                          <span className="font-mono text-sm">£{dish.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{dish.description}</p>
                        
                        {/* Reasoning Chips */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {dish.tags?.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-md bg-secondary text-xs text-secondary-foreground">
                              {tag}
                            </span>
                          ))}
                          {preferences.spiceLevel !== 'none' && (
                            <span className="px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs border border-orange-200">
                              Matches Spice Level
                            </span>
                          )}
                        </div>

                        <Button 
                          className="w-full rounded-full btn-outline hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setLocation(`/dish/${dish.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      {step !== 'loading' && step !== 'results' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-20">
          <Button 
            onClick={handleNext}
            className="w-full h-14 rounded-full text-lg font-medium shadow-lg btn-primary flex items-center justify-center gap-2 group"
          >
            {step === 'constraints' ? 'Continue to Tastes' : 'Find My Dish'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}
