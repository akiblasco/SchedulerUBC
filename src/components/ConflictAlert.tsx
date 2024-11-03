import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConflictAlertProps {
  conflicts: string[];
  onDismiss: (index: number) => void;
}

export default function ConflictAlert({ conflicts, onDismiss }: ConflictAlertProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="space-y-2">
      {conflicts.map((conflict, index) => (
        <div
          key={index}
          className="bg-red-50 border-l-4 border-red-400 p-4 flex justify-between items-start"
        >
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <div className="text-sm text-red-700">{conflict}</div>
          </div>
          <button
            onClick={() => onDismiss(index)}
            className="text-red-400 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}