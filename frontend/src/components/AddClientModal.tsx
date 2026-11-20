import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Client, DealType, PropertyType } from '../types';
import { triggerHaptic } from '../lib/telegram';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newClient: Client) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [clientType, setClientType] = useState<'BUYER' | 'TENANT' | 'SELLER'>('BUYER');
  const [rooms, setRooms] = useState<number[]>([2, 3]);
  const [district, setDistrict] = useState('Chilonzor');
  const [minPrice, setMinPrice] = useState('40000');
  const [maxPrice, setMaxPrice] = useState('60000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');

    const newClient: Client = {
      id: 'client_' + Date.now(),
      fullName: fullName || 'Yangi Mijoz',
      phone: phone || '+998 90 000 00 00',
      clientType,
      status: 'ACTIVE',
      preferences:
        clientType !== 'SELLER'
          ? {
              dealType: clientType === 'BUYER' ? 'SALE' : 'RENT_LONG',
              propertyType: 'APARTMENT',
              minPrice: parseFloat(minPrice) || 30000,
              maxPrice: parseFloat(maxPrice) || 70000,
              rooms,
              districts: [district],
            }
          : undefined,
      createdAt: new Date().toISOString(),
    };

    onAdd(newClient);
    onClose();
  };

  const toggleRoom = (roomNum: number) => {
    triggerHaptic('light');
    if (rooms.includes(roomNum)) {
      setRooms(rooms.filter((r) => r !== roomNum));
    } else {
      setRooms([...rooms, roomNum].sort());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">Yangi Mijoz Kiritish</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 space-y-3.5 text-sm">
          {/* Client Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mijoz toifasi</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setClientType('BUYER')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  clientType === 'BUYER'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Oluvchi (Sotib oladi)
              </button>
              <button
                type="button"
                onClick={() => setClientType('TENANT')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  clientType === 'TENANT'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Ijarachi (Ijara oladi)
              </button>
              <button
                type="button"
                onClick={() => setClientType('SELLER')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  clientType === 'SELLER'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Beruvchi (Mulk egasi)
              </button>
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mijoz ismi</label>
              <input
                type="text"
                placeholder="Rustam Aka"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Telefon raqami</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono font-medium"
              />
            </div>
          </div>

          {/* If Buyer / Tenant: Criteria */}
          {clientType !== 'SELLER' && (
            <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Xaridor Qidiruv Talablari
              </span>

              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Qaysi tuman kerak?</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>

              {/* Rooms Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Xonalar soni</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => toggleRoom(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        rooms.includes(num)
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      {num} x
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Min byudjet ($)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max byudjet ($)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 font-semibold text-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Mijozni saqlash va Mos uylarni topish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
