/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProcessList } from './components/dashboard/ProcessTable';
import { Rules } from './components/dashboard/Rules';
import { Settings } from './components/dashboard/Settings';
import { useSystemStore } from './lib/store';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { tick, isBoostActive } = useSystemStore();

  // Start simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'processes':
        return <ProcessList />;
      case 'rules':
        return <Rules />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
      
      {/* Simulation Overlay for "Booting" effect if needed, or just a toast */}
      {isBoostActive && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">BootBoost 実行中: システム負荷を監視しています</span>
        </div>
      )}
    </div>
  );
}
