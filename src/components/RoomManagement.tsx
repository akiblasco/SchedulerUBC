import React from 'react';
import { Building2, Plus, Trash2 } from 'lucide-react';
import type { Room } from '../types/scheduler';

interface RoomManagementProps {
  rooms: Room[];
  onAddRoom: (room: Room) => void;
  onRemoveRoom: (roomId: string) => void;
}

export default function RoomManagement({ rooms, onAddRoom, onRemoveRoom }: RoomManagementProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    capacity: '',
    features: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity) return;

    onAddRoom({
      id: crypto.randomUUID(),
      name: formData.name,
      capacity: parseInt(formData.capacity),
      features: formData.features,
      availability: true,
    });

    setFormData({ name: '', capacity: '', features: [] });
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Building2 className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Room Management</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Room Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              placeholder="Life Sciences Centre 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              className="form-input"
              min="1"
              placeholder="200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <div className="flex flex-wrap gap-2">
            {['computer', 'standard', 'accessible'].map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => handleFeatureToggle(feature)}
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.features.includes(feature)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </button>
      </form>

      <div className="divide-y">
        {rooms.map(room => (
          <div key={room.id} className="py-3 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{room.name}</h3>
              <p className="text-sm text-gray-500">
                Capacity: {room.capacity} • Features: {room.features.join(', ')}
              </p>
            </div>
            <button
              onClick={() => onRemoveRoom(room.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}