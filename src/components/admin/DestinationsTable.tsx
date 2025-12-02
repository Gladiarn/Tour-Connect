// components/admin/DestinationsTable.tsx
import React from 'react';
import { destinationsDisplayTypes } from '../types';

interface DestinationsTableProps {
  data: destinationsDisplayTypes[];
}

export default function DestinationsTable({ data }: DestinationsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
              No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
              Budget & Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((destination, index) => (
            <tr key={destination._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{destination.name}</div>
                <div className="text-xs text-gray-500">
                  Ref: {destination.reference}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {destination.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm">{destination.activityType}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">${destination.budget}</div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="text-yellow-500 mr-1">★</span>
                  {destination.rating}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}