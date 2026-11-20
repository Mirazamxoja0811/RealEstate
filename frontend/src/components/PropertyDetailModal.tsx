import React from 'react';
import { Property } from '../types';
import { X, MapPin, Phone, Send, Share2, Check } from 'lucide-react';
import { triggerHaptic } from '../lib/telegram';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  if (!property) return null;

  const handleShare = () => {
    triggerHaptic('medium');
    const url = `https://t.me/realtor_crm_bot?startapp=p_${property.id}`;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `${property.title} - $${property.price.toLocaleString()}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Mulk havolasi nusxalandi: ' + url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            {property.dealType === 'SALE' ? 'Sotuv' : 'Ijara'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Images */}
          <div className="aspect-16/10 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
            <img
              src={property.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Price */}
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${property.price.toLocaleString()}
            </div>
            <h2 className="text-base font-semibold text-gray-800 leading-snug">
              {property.title}
            </h2>
            <div className="flex items-center text-gray-500 text-xs mt-1.5">
              <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600 shrink-0" />
              <span>{property.region}, {property.district}, {property.addressLine}</span>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl text-center">
            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
              <span className="block text-xs text-gray-400">Xonalar</span>
              <span className="text-sm font-bold text-gray-800">{property.rooms} xona</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
              <span className="block text-xs text-gray-400">Maydoni</span>
              <span className="text-sm font-bold text-gray-800">{property.areaTotal} m²</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
              <span className="block text-xs text-gray-400">Qavat</span>
              <span className="text-sm font-bold text-gray-800">
                {property.floor ? `${property.floor}/${property.totalFloors}` : '1'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-1">Tavsif</h4>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Realtor Contact Box */}
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-700 font-medium">Mas'ul Rieltor:</span>
              <div className="text-sm font-bold text-gray-900">{property.realtor.fullName}</div>
              <div className="text-xs text-gray-500">{property.realtor.phone}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-3">
          <a
            href={`tel:${property.realtor.phone}`}
            onClick={() => triggerHaptic('medium')}
            className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-sm font-semibold shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>Qo'ng'iroq qilish</span>
          </a>
          <a
            href={`https://t.me/${property.realtor.telegramUsername || 'realtor_crm_bot'}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => triggerHaptic('medium')}
            className="flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-sky-600 active:scale-98 text-white rounded-xl text-sm font-semibold shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Telegramda yozish</span>
          </a>
        </div>
      </div>
    </div>
  );
};
