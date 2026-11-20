import React from 'react';
import { Building2, Plus, Users } from 'lucide-react';
import { triggerHaptic } from '../lib/telegram';

interface HeaderProps {
  activeTab: 'catalog' | 'clients' | 'matching';
  setActiveTab: (tab: 'catalog' | 'clients' | 'matching') => void;
  onOpenAddProperty: () => void;
  onOpenAddClient: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddProperty,
  onOpenAddClient,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">Rieltor CRM</h1>
            <p className="text-xs text-gray-500">Telegram Mini App</p>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenAddProperty();
            }}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Uy qo'shish</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenAddClient();
            }}
            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Mijoz</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('catalog');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'catalog'
              ? 'bg-white text-blue-600 shadow-xs font-semibold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Katalog (Uylar)
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('clients');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'clients'
              ? 'bg-white text-blue-600 shadow-xs font-semibold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Mijozlar Bazasi
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('matching');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'matching'
              ? 'bg-white text-blue-600 shadow-xs font-semibold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Smart Matching
        </button>
      </div>
    </header>
  );
};
