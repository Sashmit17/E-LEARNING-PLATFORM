// src/app/modules/instructor/view-enrollments/view-enrollments.component.ts
import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { Enrollment } from '../../../models/enrollment';
import { Student } from '../../../models/student';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-view-enrollments',
  standalone: false,
  templateUrl: './view-enrollments.component.html',
  styleUrls: ['./view-enrollments.component.css']
})
export class ViewEnrollmentsComponent implements OnInit {
  courses: Course[] = [];
  studentsMap = new Map<any, Student>();
  selectedCourseId?: number|string;
  enrollments: Enrollment[] = [];
  instructorId: any;

  constructor(
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
  
    this.catalog.getStudents().subscribe(ss => ss.forEach(s => this.studentsMap.set(String(s.id), s)));

    
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (user && user.role === 'instructor') {
      if (user.instructorId) {
        this.instructorId = (user.instructorId);
        this.loadInstructorCourses();
      } else {
        this.catalog.getInstructors().subscribe(list => {
          const found = list.find(i => (String(i.email) || '').toLowerCase() === (user.email || '').toLowerCase());
          if (found) {
            this.instructorId = (found.id);
            user.instructorId = this.instructorId;
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.loadInstructorCourses();
        }, err => {
          console.error('Failed to load instructors', err);
          this.loadInstructorCourses();
        });
      }
    } else {
      
      this.courseService.getCourses().subscribe(c => this.courses = c);
    }
  }

  private loadInstructorCourses() {
    if (!this.instructorId) {
      this.courses = [];
      return;
    }
    this.courseService.getCourses({ instructorId: this.instructorId }).subscribe(cs => this.courses = cs);
  }

  load() {
    if (!this.selectedCourseId) return;
    this.enrollSvc.getEnrollmentsByCourse(Number(this.selectedCourseId)).subscribe(e => this.enrollments = e);
  }
}
