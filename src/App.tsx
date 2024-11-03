import React from 'react';
import Header from './components/Header';
import CourseInput from './components/CourseInput';
import ScheduleView from './components/ScheduleView';
import ConflictAlert from './components/ConflictAlert';
import RoomManagement from './components/RoomManagement';
import { findAvailableRoom, findAvailableTimeSlot } from './utils/scheduler';
import type { Course, Room, ExamSlot, ScheduleState } from './types/scheduler';

function App() {
  const [state, setState] = React.useState<ScheduleState>({
    courses: [],
    rooms: [
      { id: '1', name: 'Life Sciences Centre 2', capacity: 350, features: ['computer'], availability: true },
      { id: '2', name: 'Woodward IRC 2', capacity: 250, features: ['standard'], availability: true },
      { id: '3', name: 'Forest Sciences Centre 1005', capacity: 200, features: ['standard'], availability: true },
    ],
    slots: [],
    conflicts: [],
  });

  const handleCourseAdd = (course: Course) => {
    setState(prev => {
      const newState = { ...prev };
      const availableRoom = findAvailableRoom(newState.rooms, course.studentCount);

      if (!availableRoom) {
        return {
          ...newState,
          courses: [...newState.courses, course],
          conflicts: [...newState.conflicts, `No suitable room found for ${course.code} (${course.studentCount} students)`]
        };
      }

      const timeSlot = findAvailableTimeSlot(newState.slots, availableRoom, course.duration);

      if (!timeSlot) {
        return {
          ...newState,
          courses: [...newState.courses, course],
          conflicts: [...newState.conflicts, `No available time slot found for ${course.code} in the next 14 days`]
        };
      }

      return {
        ...newState,
        courses: [...newState.courses, course],
        slots: [...newState.slots, {
          courseId: course.id,
          roomId: availableRoom.id,
          date: timeSlot.date,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
        }]
      };
    });
  };

  const handleCourseDelete = (courseId: string) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== courseId),
      slots: prev.slots.filter(s => s.courseId !== courseId)
    }));
  };

  const handleRoomAdd = (room: Room) => {
    setState(prev => ({
      ...prev,
      rooms: [...prev.rooms, room]
    }));
  };

  const handleRoomRemove = (roomId: string) => {
    setState(prev => {
      const affectedSlots = prev.slots.filter(slot => slot.roomId === roomId);
      const newConflicts = affectedSlots.map(slot => {
        const course = prev.courses.find(c => c.id === slot.courseId);
        return `Room removal affects scheduled exam: ${course?.code}`;
      });

      return {
        ...prev,
        rooms: prev.rooms.filter(r => r.id !== roomId),
        slots: prev.slots.filter(s => s.roomId !== roomId),
        conflicts: [...prev.conflicts, ...newConflicts]
      };
    });
  };

  const handleBulkUpload = (file: File) => {
    // In a real implementation, we would parse the CSV/Excel file
    console.log('Processing file:', file.name);
  };

  const dismissConflict = (index: number) => {
    setState(prev => ({
      ...prev,
      conflicts: prev.conflicts.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ConflictAlert
            conflicts={state.conflicts}
            onDismiss={dismissConflict}
          />
          
          <CourseInput
            onCourseAdd={handleCourseAdd}
            onBulkUpload={handleBulkUpload}
          />
          
          <RoomManagement
            rooms={state.rooms}
            onAddRoom={handleRoomAdd}
            onRemoveRoom={handleRoomRemove}
          />
          
          <ScheduleView
            slots={state.slots}
            courses={state.courses}
            rooms={state.rooms}
            onDeleteCourse={handleCourseDelete}
          />
        </div>
      </main>
    </div>
  );
}

export default App;