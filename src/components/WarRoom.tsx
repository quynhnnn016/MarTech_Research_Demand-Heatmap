import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, MapPin, ShieldAlert, Zap, Crosshair, Clock } from 'lucide-react';

const REGIONS = [
  { id: 'd1', name: 'District 1 (Bui Vien)', color: '#ef4444', lat: 10.7675, lng: 106.6938 },
  { id: 'gv', name: 'Go Vap (Pham Van Dong)', color: '#8b5cf6', lat: 10.8250, lng: 106.7000 },
  { id: 'd4', name: 'District 4 (Vinh Khanh)', color: '#f97316', lat: 10.7600, lng: 106.7030 },
  { id: 'd2', name: 'District 2 (Thao Dien)', color: '#3b82f6', lat: 10.8020, lng: 106.7350 },
];

const generateInitialData = () => {
  const data = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      d1: Math.floor(800 + Math.random() * 200 - 100),
      d4: Math.floor(600 + Math.random() * 150 - 75),
      d2: Math.floor(400 + Math.random() * 100 - 50),
      gv: Math.floor(700 + Math.random() * 180 - 90),
    });
  }
  return data;
};

export default function WarRoom({ onNavigateToMap }: { onNavigateToMap: (lat: number, lng: number) => void }) {
  const [chartData, setChartData] = useState(generateInitialData());
  const [leaderboard, setLeaderboard] = useState([
    { id: 'd1', name: 'District 1 (Bui Vien)', trend: 45.2, status: 'critical', currentDemand: 1050, lat: 10.7675, lng: 106.6938 },
    { id: 'gv', name: 'Go Vap (Pham Van Dong)', trend: 28.5, status: 'warning', currentDemand: 850, lat: 10.8250, lng: 106.7000 },
    { id: 'd4', name: 'District 4 (Vinh Khanh)', trend: 12.1, status: 'stable', currentDemand: 650, lat: 10.7600, lng: 106.7030 },
    { id: 'd2', name: 'District 2 (Thao Dien)', trend: -5.4, status: 'stable', currentDemand: 380, lat: 10.8020, lng: 106.7350 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const now = new Date();
        
        // Random walk with slight upward bias for some
        const nextD1 = Math.max(0, last.d1 + Math.floor(Math.random() * 80 - 30)); 
        const nextD4 = Math.max(0, last.d4 + Math.floor(Math.random() * 40 - 20));
        const nextD2 = Math.max(0, last.d2 + Math.floor(Math.random() * 30 - 15));
        const nextGv = Math.max(0, last.gv + Math.floor(Math.random() * 60 - 25));

        newData.push({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          d1: nextD1,
          d4: nextD4,
          d2: nextD2,
          gv: nextGv,
        });
        return newData;
      });

      setLeaderboard(prev => {
        return prev.map(item => {
          // Add some random jitter to trend
          const newTrend = item.trend + (Math.random() * 4 - 2);
          let status = 'stable';
          if (newTrend > 35) status = 'critical';
          else if (newTrend > 15) status = 'warning';
          
          return {
            ...item,
            trend: newTrend,
            status,
            currentDemand: Math.max(0, item.currentDemand + Math.floor(Math.random() * 30 - 10))
          };
        }).sort((a, b) => b.trend - a.trend);
      });

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Crosshair className="text-red-500" />
            Demand War Room
          </h2>
          <p className="text-gray-500 mt-2">
            Real-time monitoring of demand spikes across key districts. Data updates every 3 seconds.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 font-bold animate-pulse">
          <Activity size={20} />
          <span>LIVE MONITORING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Multi-Location Real-time Line Chart */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" />
              Real-time Demand Trajectory
            </h3>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              <Clock size={14} />
              Updating every 3s
            </div>
          </div>
          
          <div className="flex-1 min-h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: '#6b7280' }} 
                  tickMargin={10}
                  minTickGap={30}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }} 
                  axisLine={false} 
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                
                {REGIONS.map(region => (
                  <Line 
                    key={region.id}
                    type="monotone" 
                    dataKey={region.id} 
                    name={region.name} 
                    stroke={region.color} 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    isAnimationActive={false} // Disable animation for smoother real-time updates
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking Leaderboard */}
        <div className="xl:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert size={20} className="text-orange-500" />
              15-Min Spike Leaderboard
            </h3>
          </div>

          <div className="space-y-4 flex-1">
            {leaderboard.map((region, index) => (
              <div 
                key={region.id}
                onClick={() => onNavigateToMap(region.lat, region.lng)}
                className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-200 cursor-pointer group
                  ${region.status === 'critical' ? 'bg-red-50 border-red-200 hover:bg-red-100' : 
                    region.status === 'warning' ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' : 
                    'bg-blue-50 border-blue-100 hover:bg-blue-100'}
                `}
              >
                {/* Flashing indicator for critical */}
                {region.status === 'critical' && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-red-500 animate-pulse"></div>
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center
                      ${region.status === 'critical' ? 'bg-red-200 text-red-700' : 
                        region.status === 'warning' ? 'bg-orange-200 text-orange-700' : 
                        'bg-blue-200 text-blue-700'}
                    `}>
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-gray-900">{region.name}</h4>
                  </div>
                  
                  <button 
                    className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                      ${region.status === 'critical' ? 'bg-red-200 text-red-700 hover:bg-red-300' : 
                        region.status === 'warning' ? 'bg-orange-200 text-orange-700 hover:bg-orange-300' : 
                        'bg-blue-200 text-blue-700 hover:bg-blue-300'}
                    `}
                    title="Fly to Map"
                  >
                    <MapPin size={16} />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Current Demand</div>
                    <div className="text-2xl font-black text-gray-900">{region.currentDemand.toLocaleString()}</div>
                  </div>
                  
                  <div className={`flex items-center gap-1 font-bold text-lg
                    ${region.trend > 0 ? (region.status === 'critical' ? 'text-red-600' : 'text-orange-600') : 'text-blue-600'}
                  `}>
                    {region.trend > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    {region.trend > 0 ? '+' : ''}{region.trend.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Click any region card to instantly fly to its location on the Heat Map Dashboard.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
