import { describe, it, expect } from 'vitest';
import { validateCourse, checkTimeConflicts, findAvailableRoom } from '../../utils/scheduler';

describe('validateCourse', () => {
  it('validates a correct course', () => {
    const course = {
      code: 'CPSC 110',
      name: 'Computation, Programs, and Programming',
      studentCount: 200
    };
    expect(validateCourse(course)).toHaveLength(0);
  });

  it('detects missing required fields', () => {
    const course = {};
    const errors = validateCourse(course);
    expect(errors).toContain('Course code is required');
    expect(errors).toContain('Course name is required');
    expect(errors).toContain('Student count is required');
  });

  it('validates course code format', () => {
    const course = {
      code: 'invalid',
      name: 'Test Course',
      studentCount: 100
    };
    const errors = validateCourse(course);
    expect(errors).toContain('Invalid course code format (e.g., CPSC 110)');
  });

  it('validates student count is positive', () => {
    const course = {
      code: 'CPSC 110',
      name: 'Test Course',
      studentCount: -1
    };
    const errors = validateCourse(course);
    expect(errors).toContain('Student count must be positive');
  });
});

describe('checkTimeConflicts', () => {
  const existingSlots = [
    {
      date: '2024-04-15',
      startTime: '09:00',
      endTime: '11:30'
    }
  ];

  it('detects overlapping time slots', () => {
    const conflictingSlot = {
      date: '2024-04-15',
      startTime: '10:00',
      endTime: '12:30'
    };
    expect(checkTimeConflicts(existingSlots, conflictingSlot)).toBe(true);
  });

  it('allows non-overlapping time slots', () => {
    const nonConflictingSlot = {
      date: '2024-04-15',
      startTime: '13:00',
      endTime: '15:30'
    };
    expect(checkTimeConflicts(existingSlots, nonConflictingSlot)).toBe(false);
  });

  it('allows same time on different dates', () => {
    const differentDateSlot = {
      date: '2024-04-16',
      startTime: '09:00',
      endTime: '11:30'
    };
    expect(checkTimeConflicts(existingSlots, differentDateSlot)).toBe(false);
  });
});

describe('findAvailableRoom', () => {
  const rooms = [
    { id: '1', capacity: 100, availability: true },
    { id: '2', capacity: 200, availability: true },
    { id: '3', capacity: 300, availability: false }
  ];

  it('finds suitable available room', () => {
    const room = findAvailableRoom(rooms, 150);
    expect(room?.id).toBe('2');
  });

  it('returns undefined when no suitable room is available', () => {
    const room = findAvailableRoom(rooms, 400);
    expect(room).toBeUndefined();
  });

  it('considers room availability', () => {
    const room = findAvailableRoom(rooms, 250);
    expect(room?.id).toBeUndefined();
  });
});