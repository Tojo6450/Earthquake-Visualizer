// src/App.jsx
import React from 'react';
import EarthquakeMap from './EarthquakeMap';
import EarthquakeSearch from './Earthquakesearch';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-2xl border-b border-slate-700/50 z-10">
        <div className="container mx-auto ">
          <div className="flex items-center justify-center space-x-3 drop-shadow-lg">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-xl">🌍</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-md"></div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent tracking-tight drop-shadow-md">
              Real-time Earthquake Visualizer
            </h1>
          </div>
          <p className="text-center text-slate-300 text-sm mt-2 font-medium drop-shadow-sm">
            Live earthquake data visualization and monitoring
          </p>
        </div>
      </header>
      
      {/* Search Section */}
      <div className="bg-gray-700 backdrop-blur-sm border-b border-slate-200/60 shadow-md">
        <div className="container mx-auto">
          <EarthquakeSearch />
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/20 to-transparent pointer-events-none z-10"></div>
        <div className="h-full border-4 border-white/50 rounded-t-2xl shadow-2xl overflow-hidden">
          <EarthquakeMap />
        </div>
      </main>
      
      {/* Status bar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300 px-6 py-2 text-xs flex items-center justify-center space-x-4 border-t border-slate-700 shadow-inner">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
          <span>Live Data</span>
        </div>
        <div className="w-px h-4 bg-slate-600"></div>
        <span>Updated every 5 minutes</span>
        <div className="w-px h-4 bg-slate-600"></div>
        <span>USGS Earthquake API</span>
      </div>
    </div>
  );
}

export default App;
