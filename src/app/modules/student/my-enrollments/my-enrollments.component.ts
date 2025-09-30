import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnrollmentService } from '../../../services/enrollment.service';
import { CatalogService } from '../../../services/catalog.service';
import { Enrollment } from '../../../models/enrollment';
import { Course } from '../../../models/course';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-my-enrollments',
  standalone: false,
  templateUrl: './my-enrollments.component.html',
  styleUrls: ['./my-enrollments.component.css']
})
export class MyEnrollmentsComponent implements OnInit, OnDestroy {
  studentId: number | null = null;
  enrollments: (Enrollment & { course?: Course })[] = [];
  private sub = new Subscription();
  private allCourses: Course[] = [];
  
  private enrollmentData: Enrollment[] = [];
  private coursesData: Course[] = [];
  private pendingCalls = 2;

  constructor(
    private enrollSvc: EnrollmentService,
    private catalog: CatalogService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role === 'student') {
      this.studentId = user.id;
    }

    this.load();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  load() {
    if (!this.studentId) {
      this.enrollments = [];
      return;
    }
    this.pendingCalls = 2;
    this.enrollmentData = [];
    this.coursesData = [];
    this.enrollments = [];
  
    this.sub.add(
      this.enrollSvc.getEnrollmentsByStudent(this.studentId).subscribe(
        (data) => {
          this.enrollmentData = data;
          this.checkAndMerge();
        },
        (err) => { console.error('Enrollment error:', err); this.checkAndMerge(); }
      )
    );
    

    this.sub.add(
      this.catalog.getCourses({}).subscribe(
        (data) => {
          this.coursesData = data;
          this.checkAndMerge();
        },
        (err) => { console.error('Courses error:', err); this.checkAndMerge(); }
      )
    );
  }
  
  private checkAndMerge() {
    this.pendingCalls--;

    if (this.pendingCalls === 0) {
      const courseMap = new Map(this.coursesData.map(c => [Number(c.id), c]));
      
      this.enrollments = this.enrollmentData.map(e => ({
        ...e,
        course: courseMap.get(Number(e.courseId))
      }));
    }
  }

  continueLearning(courseId: number) {
    this.router.navigate(['student', 'player', Number(courseId)]);
  }
}