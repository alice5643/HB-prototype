import React, { useState } from 'react';
import { ConsoleLayout } from '@/components/ConsoleLayout';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aLaCarteMenuData } from '@/lib/data';

export default function ConsoleMenu() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Starters');

  // Flatten dishes from sections
  const allDishes = aLaCarteMenuData.flatMap(section => section.items);

  // Group dishes by category
  const categories = Array.from(new Set(allDishes.map(d => d.category))) as string[];
  const dishesByCategory = categories.reduce((acc, category) => {
    acc[category] = allDishes.filter(d => d.category === category);
    return acc;
  }, {} as Record<string, typeof allDishes>);

  return (
    <ConsoleLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#5C4033]">Menu Management</h1>
            <p className="text-[#8B4513]/70">Manage your menu items, prices, and availability.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#B59020] transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add New Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B4513]/50" />
            <input 
              type="text" 
              placeholder="Search menu items..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E0D6] rounded-lg text-[#5C4033] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg text-sm font-medium">All Items</button>
            <button className="px-4 py-2 bg-white border border-[#E5E0D6] text-[#5C4033] rounded-lg text-sm font-medium hover:bg-[#F5F2EA]">Out of Stock</button>
            <button className="px-4 py-2 bg-white border border-[#E5E0D6] text-[#5C4033] rounded-lg text-sm font-medium hover:bg-[#F5F2EA]">Hidden</button>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="bg-white border border-[#E5E0D6] rounded-xl overflow-hidden">
              <button 
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full flex items-center justify-between p-4 bg-[#FDFBF7] hover:bg-[#F5F2EA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedCategory === category ? (
                    <ChevronDown className="w-5 h-5 text-[#8B4513]/50" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#8B4513]/50" />
                  )}
                  <h3 className="font-bold text-[#5C4033]">{category}</h3>
                  <span className="text-xs font-medium bg-[#E5E0D6] text-[#8B4513] px-2 py-1 rounded-full">
                    {dishesByCategory[category].length} items
                  </span>
                </div>
              </button>

              {expandedCategory === category && (
                <div className="divide-y divide-[#E5E0D6]">
                  {dishesByCategory[category].map((dish: any) => (
                    <div key={dish.id} className="p-4 flex items-center gap-6 hover:bg-gray-50 transition-colors group">
                      {/* Image */}
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-[#E5E0D6]">
                        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-[#5C4033]">{dish.name}</h4>
                          <span className="font-bold text-[#5C4033]">${dish.price}</span>
                        </div>
                        <p className="text-sm text-[#8B4513]/70 line-clamp-1">{dish.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {dish.tags.map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] font-medium uppercase tracking-wider bg-[#F5F2EA] text-[#8B4513] px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-[#8B4513]/50 hover:text-[#D4AF37] hover:bg-[#F5F2EA] rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#8B4513]/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ConsoleLayout>
  );
}
