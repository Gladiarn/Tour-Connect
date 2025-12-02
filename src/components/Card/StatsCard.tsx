// components/admin/StatsCard.tsx
import React from 'react';
import { MapPin, Hotel, Plane, Users } from 'lucide-react';

interface StatsCardProps {
  title: 'Destinations' | 'Hotels' | 'Packages' | 'Users';
  value: number;
}

const iconMap = {
  'Destinations': MapPin,
  'Hotels': Hotel,
  'Packages': Plane,
  'Users': Users,
};

const valueColors = {
  'Destinations': 'text-blue-700',
  'Hotels': 'text-green-700',
  'Packages': 'text-purple-700',
  'Users': 'text-amber-700',
};

export default function StatsCard({ title, value }: StatsCardProps) {
  const IconComponent = iconMap[title];
  const valueColor = valueColors[title];

  return (
    <div className="w-[200px] min-w-[200px] h-24 bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${valueColor}`}>
            {value}
          </p>
        </div>
        <IconComponent className="w-7 h-7 text-gray-400" />
      </div>
    </div>
  );
}