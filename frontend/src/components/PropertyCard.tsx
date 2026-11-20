import React from 'react';
import { Property } from '../types';
import { MapPin, Phone, CheckCircle, Home } from 'lucide-react';
import { triggerHaptic } from '../lib/telegram';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const coverImage = property.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        onSelect(property);
      }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
    >
      {/* Cover Image & Badges */}
      <div className="relative aspect-16/10 bg-gray-100 overflow-hidden">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-600/90 text-white backdrop-blur-xs">
            {property.dealType === 'SALE' ? 'Sotuv' : 'Ijara'}
          </span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-black/60 text-white backdrop-blur-xs">
            {property.rooms} xona
          </span>
        </div>
        <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs">
          <span className="text-sm font-bold">
            ${property.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Body info */}
      <div className="p-3.5">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-500 text-xs mb-2.5">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
          <span className="line-clamp-1">{property.region}, {property.district}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>{property.areaTotal} m²</span>
            <span>•</span>
            <span>{property.floor ? `${property.floor}/${property.totalFloors} qavat` : 'Hovli'}</span>
          </div>

          <div className="flex items-center text-blue-600 font-medium">
            <Phone className="w-3.5 h-3.5 mr-1" />
            <span>Aloqa</span>
          </div>
        </div>
      </div>
    </div>
  );
};
