// src/app/services/enrollment.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Enrollment } from '../models/enrollment';
import { Observable, of, map} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  constructor(private api: ApiService) {}

  getEnrollments(): Observable<Enrollment[]> {
    return this.api.get<Enrollment[]>('enrollments');
  }

  getEnrollmentsByStudent(studentId: number) {
    return this.api.get<Enrollment[]>('enrollments', { studentId });
  }

  getEnrollmentsByCourse(courseId: number) {
    return this.api.get<Enrollment[]>('enrollments', { courseId });
  }

  enroll(studentId: number, courseId: number) {
    const payload = { studentId, courseId };
    return this.api.post<Enrollment>('enrollments', payload).pipe(
      map(created => ({ success: true, data: created }))
    );
  }

  findEnrollmentForStudent(studentId: number, courseId: number) {
    if (!studentId) return of(null);
    return this.getEnrollmentsByStudent(studentId).pipe(
      map(list => (list || []).find(e => Number(e.courseId) === Number(courseId)) || null)
    );
  }
 
  markWatched(enrollmentId: number, lastWatchedPosition?: number) {
   
    return this.api.put<Enrollment>(`enrollments/${enrollmentId}/watched`, lastWatchedPosition ?? null);
  }
  
  markDone(enrollmentId: number) {
    return this.api.put<Enrollment>(`enrollments/${enrollmentId}/done`, {});
  }

  setRating(enrollmentId: number, rating: number) {
    return this.api.put<Enrollment>(`enrollments/${enrollmentId}/rating`, rating);
  }
 
  updateProgress(id: number, progress: number) {
    return this.api.put<Enrollment>(`enrollments/${id}/progress`, progress);
  }

  setStatus(id: number, status: string) {
    return this.api.put<Enrollment>(`enrollments/${id}/status`, status);
  }
}
