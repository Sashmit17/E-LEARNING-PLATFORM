
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Enrollment } from '../models/enrollment';
import { Observable, of } from 'rxjs'; 

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  constructor(private api: ApiService) {}

  getEnrollments() {
    return this.api.get<Enrollment[]>('enrollments');
  }

  getEnrollmentsByStudent(studentId: number) {
    return this.api.get<Enrollment[]>('enrollments', { studentId });
  }

  getEnrollmentsByCourse(courseId: number) {
    return this.api.get<Enrollment[]>('enrollments', { courseId });
  }


  enroll(studentId: number, courseId: number): Observable<any> {
 
    return new Observable(observer => {
      this.getEnrollments().subscribe({
        next: (list) => {
          const exists = list.some(e =>
            Number(e.studentId) === Number(studentId) &&
            Number(e.courseId) === Number(courseId)
          );

          if (exists) {
           
            observer.next({ success: false, message: 'Already enrolled' });
            observer.complete();
          } else {
            
            const newEnrollment: Enrollment = {
              studentId,
              courseId,
              enrollmentDate: new Date().toISOString().slice(0, 10),
              progress: 0,
              status: 'enrolled'
            };

            this.api.post<Enrollment>('enrollments', newEnrollment).subscribe({
              next: (data) => {
                observer.next({ success: true, message: 'Enrolled', data });
                observer.complete();
              },
              error: (err) => {
                observer.error(err);
              }
            });
          }
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }
  updateProgress(id: number, progress: number): Observable<Enrollment> {
    return new Observable(observer => {
      this.api.get<Enrollment>(`enrollments/${id}`).subscribe(
        (e) => {
          this.api.put<Enrollment>(`enrollments/${id}`, { ...e, progress }).subscribe({
            next: (updatedE) => observer.next(updatedE),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
          });
        },
        (err) => observer.error(err)
      );
    });
  }

  setStatus(id: number, status: string): Observable<Enrollment> {
    return new Observable(observer => {
      this.api.get<Enrollment>(`enrollments/${id}`).subscribe(
        (e) => {
          this.api.put<Enrollment>(`enrollments/${id}`, { ...e, status }).subscribe({
            next: (updatedE) => observer.next(updatedE),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
          });
        },
        (err) => observer.error(err)
      );
    });
  }
}