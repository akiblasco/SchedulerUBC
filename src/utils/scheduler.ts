export function validateCourse(course: {
  code?: string;
  name?: string;
  studentCount?: number;
  duration?: number;
}) {
  const errors: string[] = [];

  if (!course.code) {
    errors.push('Course code is required');
  } else if (!/^[A-Z]{2,4}\s\d{3}[A-Z]?$/.test(course.code)) {
    errors.push('Invalid course code format (e.g., CPSC 110)');
  }

  if (!course.name) {
    errors.push('Course name is required');
  }

  if (!course.studentCount) {
    errors.push('Student count is required');
  } else if (course.studentCount < 1) {
    errors.push('Student count must be positive');
  }

  if (course.duration && (course.duration < 30 || course.duration > 360)) {
    errors.push('Exam duration must be between 30 and 360 minutes');
  }

  return errors;
}

export function checkTimeConflicts(
  existingSlots: Array<{ startTime: string; endTime: string; date: string; roomId: string }>,
  newSlot: { startTime: string; endTime: string; date: string; roomId: string }
) {
  return existingSlots.some(slot => {
    // Check if same room and date
    if (slot.roomId === newSlot.roomId && slot.date === newSlot.date) {
      const existingStart = new Date(`${slot.date}T${slot.startTime}`);
      const existingEnd = new Date(`${slot.date}T${slot.endTime}`);
      const newStart = new Date(`${newSlot.date}T${newSlot.startTime}`);
      const newEnd = new Date(`${newSlot.date}T${newSlot.endTime}`);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    }
    return false;
  });
}

export function findAvailableTimeSlot(
  existingSlots: Array<{ startTime: string; endTime: string; date: string; roomId: string }>,
  room: { id: string },
  duration: number = 150,
  startDate: Date = new Date()
) {
  const startHour = 9; // 9 AM
  const endHour = 19; // 7 PM
  const timeSlots = ['09:00', '12:00', '14:30'];
  
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  
  // Look for slots in the next 14 days
  for (let day = 0; day < 14; day++) {
    for (const startTime of timeSlots) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const slotDate = new Date(currentDate);
      slotDate.setHours(hours, minutes);
      
      const endTime = new Date(slotDate);
      endTime.setMinutes(endTime.getMinutes() + duration);
      
      // Skip if outside working hours
      if (slotDate.getHours() < startHour || endTime.getHours() >= endHour) {
        continue;
      }
      
      // Format the slot times
      const slot = {
        date: slotDate.toISOString().split('T')[0],
        startTime: `${String(slotDate.getHours()).padStart(2, '0')}:${String(slotDate.getMinutes()).padStart(2, '0')}`,
        endTime: `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`,
        roomId: room.id
      };
      
      // Check if this slot is available
      if (!checkTimeConflicts(existingSlots, slot)) {
        return slot;
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return null;
}

export function findAvailableRoom(
  rooms: Array<{ id: string; capacity: number; availability: boolean }>,
  studentCount: number
) {
  return rooms.find(room => room.capacity >= studentCount && room.availability);
}