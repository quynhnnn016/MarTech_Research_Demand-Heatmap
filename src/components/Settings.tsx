import React, { useState } from 'react';
import { Sliders, Bell, Map as MapIcon, Shield, Save, Activity, Clock } from 'lucide-react';

export default function Settings({ onApplySettings }: { onApplySettings?: () => void }) {
  const [radius, setRadius] = useState(5);
  const [threshold, setThreshold] = useState(600);
  const [timeWindow, setTimeWindow] = useState(4);
  const [priority, setPriority] = useState(50); // 0 = Food/Nightlife, 100 = Medicine/Health
  
  const [services, setServices] = useState({
    pharmacy: true,
    clinic: true,
    food: true,
    pub: false,
  });

  const handleServiceToggle = (key: keyof typeof services) => {
    setServices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Sliders className="text-orange-500" />
          Algorithm Configuration
        </h2>
        <button 
          onClick={onApplySettings}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Save size={18} />
          Save & Apply
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Algorithm Parameters */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="text-gray-400" size={20} />
            Demand Calculation Logic
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Minimum Demand Threshold</label>
                <span className="text-sm font-bold text-orange-500">{threshold}</span>
              </div>
              <input 
                type="range" 
                min="100" max="1000" step="50"
                value={threshold} 
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-xs text-gray-500 mt-2">Only display hotspots with a calculated demand index above this value.</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Priority Weighting</label>
                <span className="text-sm font-bold text-blue-500">
                  {priority < 50 ? 'Food & Nightlife' : priority > 50 ? 'Medicine & Health' : 'Balanced'}
                </span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="10"
                value={priority} 
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-orange-400 via-gray-300 to-blue-500 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Food/Nightlife</span>
                <span>Medicine/Health</span>
              </div>
            </div>
          </div>
        </section>

        {/* Temporal Settings */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="text-gray-400" size={20} />
            Temporal Parameters
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Time Window for Social Posts</label>
                <span className="text-sm font-bold text-orange-500">Last {timeWindow} hours</span>
              </div>
              <input 
                type="range" 
                min="1" max="24" 
                value={timeWindow} 
                onChange={(e) => setTimeWindow(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-xs text-gray-500 mt-2">How far back the NLP engine should look for social media mentions and check-ins.</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700 block mb-3">Priority Service Types</label>
              <div className="grid grid-cols-2 gap-3">
                <ServiceToggle label="Pharmacies" active={services.pharmacy} onClick={() => handleServiceToggle('pharmacy')} />
                <ServiceToggle label="24/7 Clinics" active={services.clinic} onClick={() => handleServiceToggle('clinic')} />
                <ServiceToggle label="Late Night Food" active={services.food} onClick={() => handleServiceToggle('food')} />
                <ServiceToggle label="Pubs & Bars" active={services.pub} onClick={() => handleServiceToggle('pub')} />
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="text-gray-400" size={20} />
            Privacy & Data Sharing
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            HangoverIntel uses anonymized, aggregated data to calculate demand indices. Your real-time location is only used locally to calculate routes and distances, and is not shared with other partners.
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500" />
            <span className="text-sm text-gray-700 font-medium">Share anonymous route completion data to improve system accuracy</span>
          </label>
        </section>
      </div>
    </div>
  );
}

function ServiceToggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
        active 
          ? 'bg-orange-50 border-orange-200 text-orange-700' 
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
