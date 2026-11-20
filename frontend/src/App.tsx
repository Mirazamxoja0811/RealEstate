import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { AddClientModal } from './components/AddClientModal';
import { MatchingView } from './components/MatchingView';
import { Property, Client } from './types';
import { initTelegram, triggerHaptic } from './lib/telegram';
import { Search, Filter, Phone, UserCheck, Home } from 'lucide-react';

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Chilonzor 9-kvartal, 3-xonali toza ta\'mirli kvartira',
    description: 'Yevro ta\'mir, barcha mebel va texnikalari qoladi. Maktab, bolalar bog\'chasi va Mirzo Ulug\'bek metrosiga yaqin joylashgan. Hujjatlari toza, sotuvga tayyor.',
    dealType: 'SALE',
    propertyType: 'APARTMENT',
    price: 54000,
    currency: 'USD',
    rooms: 3,
    floor: 4,
    totalFloors: 9,
    areaTotal: 74,
    renovation: 'EURO',
    region: 'Toshkent sh.',
    district: 'Chilonzor',
    addressLine: '9-kvartal, 14-uy',
    hasElevator: true,
    hasParking: true,
    media: [
      {
        id: 'm1',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        isCover: true,
      },
    ],
    realtor: {
      id: 'r1',
      fullName: 'Ali Rieltor',
      phone: '+998 90 123 45 67',
      telegramUsername: 'ali_realtor',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'Yunusobod 11-kvartal, 2-xonali shinam xonadon',
    description: 'O\'rtacha ta\'mir, metroga 5 daqiqalik masofa. Ijaraga yoki yashash uchun ideal variant.',
    dealType: 'SALE',
    propertyType: 'APARTMENT',
    price: 43000,
    currency: 'USD',
    rooms: 2,
    floor: 2,
    totalFloors: 5,
    areaTotal: 52,
    renovation: 'MEDIUM',
    region: 'Toshkent sh.',
    district: 'Yunusobod',
    addressLine: '11-kvartal, 8-uy',
    media: [
      {
        id: 'm2',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        isCover: true,
      },
    ],
    realtor: {
      id: 'r1',
      fullName: 'Ali Rieltor',
      phone: '+998 90 123 45 67',
      telegramUsername: 'ali_realtor',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    title: 'Mirzo Ulug\'bek, 4-xonali premium hovli / uchastka',
    description: '4 sotix, 4 xona, yozgi oshxona, basseyn va garaji bor. Tinch mahalla.',
    dealType: 'SALE',
    propertyType: 'HOUSE',
    price: 135000,
    currency: 'USD',
    rooms: 4,
    areaTotal: 180,
    renovation: 'EURO',
    region: 'Toshkent sh.',
    district: 'Mirzo Ulug\'bek',
    addressLine: 'Sayram mahallasi',
    media: [
      {
        id: 'm3',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        isCover: true,
      },
    ],
    realtor: {
      id: 'r1',
      fullName: 'Ali Rieltor',
      phone: '+998 90 123 45 67',
      telegramUsername: 'ali_realtor',
    },
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    fullName: 'Rustam Karimov',
    phone: '+998 90 987 65 43',
    clientType: 'BUYER',
    status: 'ACTIVE',
    preferences: {
      dealType: 'SALE',
      propertyType: 'APARTMENT',
      minPrice: 45000,
      maxPrice: 60000,
      rooms: [3],
      districts: ['Chilonzor'],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    fullName: 'Dilshod Shukurov',
    phone: '+998 93 555 44 33',
    clientType: 'BUYER',
    status: 'ACTIVE',
    preferences: {
      dealType: 'SALE',
      propertyType: 'APARTMENT',
      minPrice: 38000,
      maxPrice: 48000,
      rooms: [2],
      districts: ['Yunusobod'],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c3',
    fullName: 'Nodira Opa (Mulk Egasi)',
    phone: '+998 97 111 22 33',
    clientType: 'SELLER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'clients' | 'matching'>('catalog');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);

  // Filters
  const [search, setSearch] = useState('');
  const [dealFilter, setDealFilter] = useState<string>('ALL');
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  useEffect(() => {
    initTelegram();
  }, []);

  const handleAddProperty = (newProp: Partial<Property>) => {
    setProperties([newProp as Property, ...properties]);
    // Notify or open matching tab
    setActiveTab('matching');
  };

  const handleAddClient = (newClient: Client) => {
    setClients([newClient, ...clients]);
    if (newClient.clientType === 'BUYER' || newClient.clientType === 'TENANT') {
      setActiveTab('matching');
    }
  };

  // Filtered properties
  const filteredProperties = properties.filter((prop) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        prop.title.toLowerCase().includes(q) ||
        prop.district.toLowerCase().includes(q) ||
        prop.region.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (dealFilter !== 'ALL' && prop.dealType !== dealFilter) return false;
    if (selectedRooms !== null && prop.rooms !== selectedRooms) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-16 max-w-xl mx-auto bg-gray-50/50">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddProperty={() => setIsAddPropertyOpen(true)}
        onOpenAddClient={() => setIsAddClientOpen(true)}
      />

      <main className="p-4">
        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tuman, ko'cha yoki xona bo'yicha qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 shadow-2xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {['ALL', 'SALE', 'RENT_LONG'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      triggerHaptic('light');
                      setDealFilter(type);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      dealFilter === type
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {type === 'ALL' ? 'Barchasi' : type === 'SALE' ? 'Sotuv' : 'Ijara'}
                  </button>
                ))}

                {[1, 2, 3, 4].map((room) => (
                  <button
                    key={room}
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedRooms(selectedRooms === room ? null : room);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedRooms === room
                        ? 'bg-gray-800 text-white shadow-2xs'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {room}-xona
                  </button>
                ))}
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={setSelectedProperty}
                />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                Bunday filtrlar bo'yicha hozircha mulk topilmadi.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLIENTS */}
        {activeTab === 'clients' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Mijozlar Ro'yxati ({clients.length})
              </span>
            </div>

            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{client.fullName}</span>
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded-md ${
                        client.clientType === 'BUYER'
                          ? 'bg-blue-100 text-blue-700'
                          : client.clientType === 'TENANT'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {client.clientType === 'BUYER'
                        ? 'Oluvchi'
                        : client.clientType === 'TENANT'
                        ? 'Ijarachi'
                        : 'Beruvchi'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">{client.phone}</div>
                  {client.preferences && (
                    <div className="text-xs text-gray-400 mt-1">
                      {client.preferences.districts.join(', ')} • {client.preferences.rooms.join(', ')}-xona • ${client.preferences.minPrice.toLocaleString()}-${client.preferences.maxPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                <a
                  href={`tel:${client.phone}`}
                  onClick={() => triggerHaptic('light')}
                  className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SMART MATCHING */}
        {activeTab === 'matching' && (
          <MatchingView
            clients={clients}
            properties={properties}
            onSelectProperty={setSelectedProperty}
          />
        )}
      </main>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      <AddPropertyModal
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onAdd={handleAddProperty}
      />

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onAdd={handleAddClient}
      />
    </div>
  );
};
