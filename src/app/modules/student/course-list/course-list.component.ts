
import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Course } from '../../../models/course'; 

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  selectedStudentId = 0;
  search = '';
  message = '';

  constructor(
    private catalog: CatalogService,
    private enrollSvc: EnrollmentService,
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    if (user && user.role === 'student') {
      this.selectedStudentId = user.id;
    }
    this.load();
  }

  load() {
    this.catalog.getCourses({ search: this.search })
      .subscribe(c => {
   
        this.courses = c.map(course => ({
          ...course,
          isEnrolled: false 
        }));
      });
  }

 
  enroll(course: Course) { 
    course.isEnrolled = true; 
    
    this.message = `Processing enrollment for ${course.title}...`;
    
    this.enrollSvc.enroll(this.selectedStudentId, course.id).subscribe({
      next: (res: any) => {
        this.message = res.success 
          ? `Enrollment successful for ${course.title}!` 
          : `Enrollment failed: ${res.message}`;
      },
      error: (err) => {
        course.isEnrolled = false; 
        this.message = `Error enrolling in ${course.title}. Please try again.`;
        console.error('Enrollment error:', err);
      }
    });
  }
}