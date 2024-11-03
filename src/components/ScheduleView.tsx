import React from 'react';
import { Calendar, Clock, Users, MapPin, Download, Trash2 } from 'lucide-react';
import type { ExamSlot, Course, Room } from '../types/scheduler';

interface ScheduleViewProps {
  slots: ExamSlot[];
  courses: Course[];
  rooms: Room[];
  onDeleteCourse: (courseId: string) => void;
}

export default function ScheduleView({ slots, courses, rooms, onDeleteCourse }: ScheduleViewProps) {
  const groupedSlots = React.useMemo(() => {
    return slots.reduce((acc, slot) => {
      const date = new Date(slot.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, ExamSlot[]>);
  }, [slots]);

  const getCourse = (courseId: string) => courses.find(c => c.id === courseId);
  const getRoom = (roomId: string) => rooms.find(r => r.id === roomId);

  const handleExport = () => {
    const scheduleData = slots.map(slot => {
      const course = getCourse(slot.courseId);
      const room = getRoom(slot.roomId);
      return {
        date: new Date(slot.date).toLocaleDateString(),
        startTime: slot.startTime,
        endTime: slot.endTime,
        courseCode: course?.code,
        courseName: course?.name,
        room: room?.name,
        students: course?.studentCount
      };
    });

    const csv = [
      ['Date', 'Start Time', 'End Time', 'Course Code', 'Course Name', 'Room', 'Students'],
      ...scheduleData.map(row => Object.values(row))
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam-schedule.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Exam Schedule</h2>
        <button 
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Schedule
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No exams scheduled yet</p>
          <p className="text-sm">Add courses to generate the schedule</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([date, daySlots]) => (
            <div key={date} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <h3 className="font-medium">{date}</h3>
                </div>
              </div>
              
              <div className="divide-y">
                {daySlots.map((slot) => {
                  const course = getCourse(slot.courseId);
                  const room = getRoom(slot.roomId);
                  
                  if (!course || !room) return null;
                  
                  return (
                    <div key={slot.courseId} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">{course.code}</h4>
                          <p className="text-gray-600">{course.name}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {slot.startTime} - {slot.endTime}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {course.studentCount} students
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {room.name}
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteCourse(course.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}