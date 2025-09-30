// src/app/modules/student/student-dashboard/student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course';
import { Enrollment } from '../../../models/enrollment';
import { Router } from '@angular/router';
// import { forkJoin } from 'rxjs'; // <-- REMOVED

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  selectedStudentId: number = 0;
  selectedStudentName!:string;

  coursesById = new Map<number, Course>();
  enrollments: (Enrollment & { course?: Course })[] = [];

  // stats
  enrolledCount = 0;
  learningHours = 0;
  certificates = 0;
  averageProgress = 0;
  
  // ✅ Flags/Counters for dashboard logic
  private enrollmentData: Enrollment[] = [];
  private coursesData: Course[] = [];
  private pendingCalls = 0;

  constructor(
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role === 'student') {
      this.selectedStudentId = user.id;
      this.selectedStudentName = user.name;
    }
    this.loadDashboard();
  }

  loadDashboard() {
    if (!this.selectedStudentId) {
      this.enrollments = [];
      this.coursesById.clear();
      this.computeStats();
      return;
    }
    
    this.pendingCalls = 2;
    this.enrollmentData = [];
    this.coursesData = [];
    this.enrollments = [];
    
    this.catalog.getCourses({}).subscribe(
      (data) => {
        this.coursesData = data;
        this.checkAndMerge();
      },
      (err) => { console.error('Courses error:', err); this.checkAndMerge(); }
    );
    
    this.enrollSvc.getEnrollmentsByStudent(this.selectedStudentId).subscribe(
      (data) => {
        this.enrollmentData = data;
        this.checkAndMerge();
      },
      (err) => { console.error('Enrollment error:', err); this.checkAndMerge(); }
    );
  }
  
  private checkAndMerge() {
    this.pendingCalls--;

    if (this.pendingCalls === 0) {
      this.coursesById.clear();
      this.coursesData.forEach(c => this.coursesById.set(Number(c.id), c));

      this.enrollments = (this.enrollmentData || []).map(e => ({
        ...e,
        course: this.coursesById.get(Number(e.courseId))
      }));
      
      this.computeStats();
    }
  }

  computeStats() {
    this.enrolledCount = this.enrollments.length;
    this.learningHours = this.enrollments.reduce((sum, e) => {
      const course = this.coursesById.get(Number(e.courseId));
      const dur = course?.durationHrs ?? 0;
      return sum + dur;
    }, 0);

    this.certificates = this.enrollments.filter(e => e.status === 'completed').length;

    this.averageProgress = this.enrollments.length
      ? Math.round(this.enrollments.reduce((s, e) => s + (e.progress ?? 0), 0) / this.enrollments.length)
      : 0;
  }

  courseFor(e: Enrollment): Course | undefined {
    return this.coursesById.get(Number(e.courseId));
  }
}