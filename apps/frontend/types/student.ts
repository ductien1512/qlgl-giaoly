export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  note?: string;
}

export interface Student {
  id: string;
  code: string;
  saintName?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  dateOfBaptism?: string;
  address?: string;
  note?: string;
  parishId?: string;
  parish?: Parish;
  guardians: Guardian[];
  classEnrollments: ClassEnrollment[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Parish {
  id: string;
  name: string;
  description?: string;
  address?: string;
}

export interface ClassEnrollment {
  id: string;
  classId: string;
  studentId: string;
  enrolledAt: string;
  leftAt?: string;
  note?: string;
  class: {
    id: string;
    name: string;
    gradeLevel: string;
    academicYear: string;
    room?: string;
    teacher?: {
      id: string;
      fullName: string;
      phone?: string;
    };
  };
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface StudentFilters {
  search?: string;
  gender?: Gender;
  parishId?: string;
  classId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StudentStats {
  total: number;
  byGender: {
    MALE?: number;
    FEMALE?: number;
    OTHER?: number;
  };
  byParish: Array<{
    parish: string;
    count: number;
  }>;
}