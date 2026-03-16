import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Map as MapIcon, 
  Activity, 
  Database, 
  Settings, 
  Menu,
  Bell,
  Search,
  Flame,
  MapPin,
  Store,
  CalendarDays,
  ShieldAlert
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Architecture from './components/Architecture';
import SettingsModule from './components/Settings';
import EventIntelligence from './components/EventIntelligence';
import WarRoom from './components/WarRoom';
import { INITIAL_HOTSPOTS, REGULAR_PLACES } from './data';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 10.7769, lng: 106.7009, zoom: 13 });
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Settings State (for simulating reload)
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Handle click outside search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { hotspots: [], regular: [] };
    const query = searchQuery.toLowerCase();
    
    const hotspots = INITIAL_HOTSPOTS.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.type.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query)
    );
    
    const regular = REGULAR_PLACES.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.type.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query)
    );
    
    return { hotspots, regular };
  }, [searchQuery]);

  const handleSelectSearchResult = (place: any) => {
    setSelectedPlace(place);
    setMapCenter({ lat: place.lat, lng: place.lng - 0.015, zoom: 15 });
    setActiveTab('dashboard');
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleNavigateToMap = (lat: number, lng: number) => {
    setMapCenter({ lat, lng, zoom: 15 });
    setActiveTab('dashboard');
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Flame size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Hangover<span className="text-orange-500">Intel</span></span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem 
            icon={<MapIcon size={20} />} 
            label="Heat Map Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<ShieldAlert size={20} />} 
            label="Demand War Room" 
            active={activeTab === 'warroom'} 
            onClick={() => setActiveTab('warroom')} 
          />
          <NavItem 
            icon={<Database size={20} />} 
            label="Architecture & Logic" 
            active={activeTab === 'architecture'} 
            onClick={() => setActiveTab('architecture')} 
          />
          <NavItem 
            icon={<CalendarDays size={20} />} 
            label="Event Intelligence" 
            active={activeTab === 'events'} 
            onClick={() => setActiveTab('events')} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              SA
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Solutions Architect</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
              <Menu size={20} />
            </button>
            <div className="relative" ref={searchRef}>
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search regions, keywords..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-orange-500 transition-colors w-64 md:w-80 text-gray-900 placeholder:text-gray-400"
              />
              
              {/* Autocomplete Dropdown */}
              {showSearchResults && searchQuery.trim() && (searchResults.hotspots.length > 0 || searchResults.regular.length > 0) && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-[1000] max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                  {searchResults.hotspots.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-1">Hotspots</div>
                      {searchResults.hotspots.map(place => (
                        <button
                          key={place.id}
                          onClick={() => handleSelectSearchResult(place)}
                          className="w-full text-left px-3 py-2 hover:bg-orange-50 rounded-lg flex items-start gap-3 transition-colors"
                        >
                          <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${place.status === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            <Flame size={12} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{place.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{place.address}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.regular.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-1">Places</div>
                      {searchResults.regular.map(place => (
                        <button
                          key={place.id}
                          onClick={() => handleSelectSearchResult(place)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-start gap-3 transition-colors"
                        >
                          <div className="mt-0.5 w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                            <Store size={12} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{place.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{place.type} • {place.address}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-600">System Online</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative text-gray-600">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <Dashboard 
              selectedPlace={selectedPlace} 
              setSelectedPlace={setSelectedPlace}
              mapCenter={mapCenter}
              setMapCenter={setMapCenter}
              isRecalculating={isRecalculating}
            />
          )}
          {activeTab === 'warroom' && <WarRoom onNavigateToMap={handleNavigateToMap} />}
          {activeTab === 'architecture' && <Architecture />}
          {activeTab === 'events' && <EventIntelligence />}
          {activeTab === 'feed' && <div className="text-gray-500 flex items-center justify-center h-full">Live Feed Module (Simulated)</div>}
          {activeTab === 'settings' && (
            <SettingsModule 
              onApplySettings={() => {
                setIsRecalculating(true);
                setActiveTab('dashboard');
                setTimeout(() => setIsRecalculating(false), 2500);
              }} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-orange-50 text-orange-600 font-medium border border-orange-200' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default App;
