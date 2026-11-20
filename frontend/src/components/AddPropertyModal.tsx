import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Property, DealType, PropertyType, Renovation } from '../types';
import { triggerHaptic } from '../lib/telegram';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newProperty: Partial<Property>) => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [dealType, setDealType] = useState<DealType>('SALE');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [price, setPrice] = useState('');
  const [rooms, setRooms] = useState('3');
  const [areaTotal, setAreaTotal] = useState('');
  const [floor, setFloor] = useState('4');
  const [totalFloors, setTotalFloors] = useState('9');
  const [region, setRegion] = useState('Toshkent sh.');
  const [district, setDistrict] = useState('Chilonzor');
  const [addressLine, setAddressLine] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');

    const newProp: Partial<Property> = {
      id: 'prop_' + Date.now(),
      title: title || `${rooms}-xonali ${propertyType === 'APARTMENT' ? 'kvartira' : 'uy'}, ${district}`,
      dealType,
      propertyType,
      price: parseFloat(price) || 50000,
      currency: 'USD',
      rooms: parseInt(rooms, 10) || 1,
      areaTotal: parseFloat(areaTotal) || 65,
      floor: parseInt(floor, 10) || 1,
      totalFloors: parseInt(totalFloors, 10) || 1,
      renovation: 'EURO',
      region,
      district,
      addressLine: addressLine || `${district} tumani`,
      description: description || 'Yangi ta\'mirlangan, barcha sharoitlari mavjud shinam uy.',
      media: [
        {
          id: 'm1',
          url: photoUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
          isCover: true,
        },
      ],
      realtor: {
        id: 'u1',
        fullName: 'Ali Rieltor',
        phone: '+998 90 123 45 67',
        telegramUsername: 'ali_realtor',
      },
      createdAt: new Date().toISOString(),
    };

    onAdd(newProp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">Yangi Mulk Kiritish (Beruvchi)</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 space-y-3.5 text-sm">
          {/* Deal type & Property type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Bitim turi</label>
              <select
                value={dealType}
                onChange={(e) => setDealType(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
              >
                <option value="SALE">Sotuv (Sale)</option>
                <option value="RENT_LONG">Uzoq muddatli ijara</option>
                <option value="RENT_DAILY">Kunlik ijara</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mulk turi</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
              >
                <option value="APARTMENT">Kvartira</option>
                <option value="HOUSE">Hovli / Uchastka</option>
                <option value="COMMERCIAL">Tijorat mulki</option>
                <option value="NEW_BUILDING">Novostroyka</option>
              </select>
            </div>
          </div>

          {/* Price & Rooms */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Narxi ($ USD)</label>
              <input
                type="number"
                placeholder="55000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold text-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Xonalar soni</label>
              <select
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold"
              >
                <option value="1">1 xona</option>
                <option value="2">2 xona</option>
                <option value="3">3 xona</option>
                <option value="4">4 xona</option>
                <option value="5">5+ xona</option>
              </select>
            </div>
          </div>

          {/* Area & Floor */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Maydoni (m²)</label>
              <input
                type="number"
                placeholder="72"
                value={areaTotal}
                onChange={(e) => setAreaTotal(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Qavat</label>
              <input
                type="number"
                placeholder="4"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Umumiy qavat</label>
              <input
                type="number"
                placeholder="9"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* District & Address */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tuman</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Aniq manzil</label>
              <input
                type="text"
                placeholder="Chilonzor 9-kvartal, 14-uy"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Rasm URL (yoki internet linki)</label>
            <input
              type="url"
              placeholder="https://..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Qo'shimcha tavsif</label>
            <textarea
              rows={2}
              placeholder="Uy haqida qisqacha ma'lumot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Mulkni saqlash va Matchingni ishga tushirish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
