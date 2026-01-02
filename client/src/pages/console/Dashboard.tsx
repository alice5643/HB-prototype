import React from 'react';
import { ConsoleLayout } from '@/components/ConsoleLayout';
import { Clock, Users, Bell, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '10am', orders: 5 },
  { time: '11am', orders: 12 },
  { time: '12pm', orders: 45 },
  { time: '1pm', orders: 62 },
  { time: '2pm', orders: 35 },
  { time: '3pm', orders: 20 },
  { time: '4pm', orders: 15 },
  { time: '5pm', orders: 55 },
  { time: '6pm', orders: 85 },
];

const hesitationData = [
  { name: 'Truffle Arancini', time: '82s', conv: '12%' },
  { name: 'Wagyu Slider', time: '65s', conv: '24%' },
  { name: 'Lobster Ravioli', time: '94s', conv: '8%' },
];

const recentActivity = [
  { type: 'order', text: 'Table 4 placed an order', time: '2 mins ago', value: '$124.50' },
  { type: 'request', text: 'Table 7 requested Bill', time: '5 mins ago', status: 'Pending' },
  { type: 'staff', text: 'Sarah J. clocked in', time: '12 mins ago' },
];

export default function ConsoleDashboard() {
  return (
    <ConsoleLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#5C4033]">Dashboard</h1>
            <p className="text-[#8B4513]/70">Overview of your venue's performance today.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#8B4513]/70">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Live</span>
            <span>Last updated: Just now</span>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Seating to Order"
            value="8m 12s"
            change="-4%"
            trend="down"
            subtext="Avg time taken"
            icon={Clock}
          />
          <MetricCard 
            title="Split Usage"
            value="42%"
            change="+12%"
            trend="up"
            subtext="Payment splits"
            icon={Users}
          />
          <MetricCard 
            title="Service Requests"
            value="156"
            change="+8%"
            trend="up"
            subtext="Today's total"
            icon={Bell}
          />
          <MetricCard 
            title="Hesitation Rate"
            value="18%"
            change="-2%"
            trend="down"
            subtext="High menu view time"
            icon={AlertCircle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E5E0D6] shadow-sm">
            <h3 className="text-lg font-medium text-[#5C4033] mb-1">Orders Over Time</h3>
            <p className="text-sm text-[#8B4513]/70 mb-6">Today's order volume by hour</p>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0D6" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8B4513', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8B4513', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFBF0', borderColor: '#D4AF37', borderRadius: '8px' }}
                    itemStyle={{ color: '#5C4033' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#D4AF37" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            {/* Hesitation Dishes */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E0D6] shadow-sm">
              <h3 className="text-lg font-medium text-[#5C4033] mb-1">Hesitation Dishes</h3>
              <p className="text-sm text-[#8B4513]/70 mb-4">Viewed &gt;60s but not ordered</p>
              
              <div className="space-y-4">
                {hesitationData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#FDFBF7] rounded-lg border border-[#E5E0D6]/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#5C4033]">{item.name}</p>
                        <p className="text-xs text-[#8B4513]/70">Avg view: {item.time}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-[#E5E0D6] text-[#5C4033] px-2 py-1 rounded">
                      {item.conv} conv.
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E0D6] shadow-sm">
              <h3 className="text-lg font-medium text-[#5C4033] mb-4">Recent Activity</h3>
              <div className="space-y-6 relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#E5E0D6]" />
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm",
                      item.type === 'order' ? "bg-green-100 text-green-600" :
                      item.type === 'request' ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {item.type === 'order' ? <ArrowUp className="w-4 h-4" /> :
                       item.type === 'request' ? <Bell className="w-4 h-4" /> :
                       <Users className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-[#5C4033]">{item.text}</p>
                        {item.value && <span className="text-sm font-bold text-[#5C4033]">{item.value}</span>}
                        {item.status && (
                          <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            {item.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8B4513]/70 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
}

function MetricCard({ title, value, change, trend, subtext, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#E5E0D6] shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-[#8B4513]/70">{title}</h3>
        <Icon className="w-4 h-4 text-[#D4AF37]" />
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-[#5C4033]">{value}</span>
        <span className={cn(
          "text-xs font-medium flex items-center",
          trend === 'up' && change.includes('+') ? "text-green-600" : 
          trend === 'down' && change.includes('-') ? "text-green-600" : "text-red-600"
        )}>
          {change}
        </span>
      </div>
      <p className="text-xs text-[#8B4513]/50">{subtext}</p>
    </div>
  );
}

import { UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
