import React from 'react';
import { Calendar, School } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-6 px-8 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <School className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">UBC Exam Scheduler</h1>
            <p className="text-blue-200">Final Examination Management System</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">2024 Winter Session</span>
        </div>
      </div>
    </header>
  );
}