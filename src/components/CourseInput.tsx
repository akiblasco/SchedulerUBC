import React from 'react';
import { Upload, Plus, FileSpreadsheet } from 'lucide-react';
import type { Course } from '../types/scheduler';
import { validateCourse } from '../utils/scheduler';

interface CourseInputProps {
  onCourseAdd: (course: Course) => void;
  onBulkUpload: (file: File) => void;
}

export default function CourseInput({ onCourseAdd, onBulkUpload }: CourseInputProps) {
  const [formData, setFormData] = React.useState<Partial<Course>>({
    code: '',
    name: '',
    studentCount: undefined,
    duration: 150, // default 2.5 hours
    preferredTime: ''
  });
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCourse(formData);
    setErrors(validationErrors);

    if (validationErrors.length === 0 && formData.code && formData.name && formData.studentCount) {
      onCourseAdd({
        id: crypto.randomUUID(),
        code: formData.code,
        name: formData.name,
        studentCount: formData.studentCount,
        duration: formData.duration || 150,
        preferredTime: formData.preferredTime
      });
      setFormData({
        code: '',
        name: '',
        studentCount: undefined,
        duration: 150,
        preferredTime: ''
      });
      setErrors([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Add Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <ul className="text-sm text-red-700 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              className="form-input"
              placeholder="CPSC 110"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              placeholder="Computation, Programs, and Programming"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Count</label>
            <input
              type="number"
              value={formData.studentCount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, studentCount: parseInt(e.target.value) || undefined }))}
              className="form-input"
              min="1"
              placeholder="200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 150 }))}
              className="form-input"
              min="30"
              step="30"
              placeholder="150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Time (Optional)</label>
            <input
              type="datetime-local"
              value={formData.preferredTime}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
              className="form-input"
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </button>
          
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx"
              onChange={(e) => e.target.files?.[0] && onBulkUpload(e.target.files[0])}
            />
          </label>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Download Template
          </button>
        </div>
      </form>
    </div>
  );
}