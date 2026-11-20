import React from 'react';
import { Client, Property } from '../types';
import { Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../lib/telegram';

interface MatchingViewProps {
  clients: Client[];
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const MatchingView: React.FC<MatchingViewProps> = ({ clients, properties, onSelectProperty }) => {
  const buyers = clients.filter((c) => c.clientType === 'BUYER' || c.clientType === 'TENANT');
  const [selectedClientId, setSelectedClientId] = React.useState<string>(buyers[0]?.id || '');
  const [sentSmsId, setSentSmsId] = React.useState<string | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || buyers[0];

  // Calculate matching score locally for instant demonstration
  const getMatches = () => {
    if (!selectedClient?.preferences) return [];
    const pref = selectedClient.preferences;

    return properties
      .map((prop) => {
        let score = 0;
        if (prop.dealType === pref.dealType) score += 25;
        if (pref.districts.some((d) => d.toLowerCase() === prop.district.toLowerCase())) score += 30;
        if (pref.rooms.includes(prop.rooms)) score += 25;
        if (prop.price >= pref.minPrice && prop.price <= pref.maxPrice) {
          score += 20;
        } else if (prop.price <= pref.maxPrice * 1.05) {
          score += 10;
        }

        return { property: prop, score };
      })
      .filter((m) => m.score >= 50)
      .sort((a, b) => b.score - a.score);
  };

  const matches = getMatches();

  const handleSendSms = (propId: string) => {
    triggerHaptic('success');
    setSentSmsId(propId);
    setTimeout(() => {
      setSentSmsId(null);
    }, 4000);
  };

  return (
    <div className="space-y-4">
      {/* Client selector pills */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Xaridorni tanlang:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {buyers.map((client) => (
            <button
              key={client.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedClientId(client.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedClient?.id === client.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {client.fullName}
            </button>
          ))}
        </div>

        {selectedClient?.preferences && (
          <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">
              📍 {selectedClient.preferences.districts.join(', ')}
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">
              🚪 {selectedClient.preferences.rooms.join(', ')}-xona
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-emerald-700">
              💰 ${selectedClient.preferences.minPrice.toLocaleString()} - ${selectedClient.preferences.maxPrice.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Match Results list */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Mos keluvchi uylar ({matches.length})</span>
          </div>
          <span className="text-xs text-gray-400">Smart Matching Engine</span>
        </div>

        {matches.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Hozircha to'liq mos uy yo'q</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Xaridor talabi saqlandi. Bir necha kundan so'ng yangi mos uy kiritilsa, tizim avtomatik SMS yuboradi!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map(({ property, score }) => (
              <div
                key={property.id}
                className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs transition-all space-y-3"
              >
                <div
                  className="flex gap-3 cursor-pointer"
                  onClick={() => onSelectProperty(property)}
                >
                  <img
                    src={property.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'}
                    alt={property.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-bold text-gray-900">
                        ${property.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          score >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {score}% Moslik
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{property.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{property.region}, {property.district}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {property.rooms} xona • {property.areaTotal} m²
                    </p>
                  </div>
                </div>

                {/* SMS Dispatch button */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-2xs text-gray-400">
                    Mijoz: {selectedClient.phone}
                  </span>
                  {sentSmsId === property.id ? (
                    <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      SMS yuborildi!
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendSms(property.id)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 text-xs font-semibold rounded-lg transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>Xaridorga SMS yuborish</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
