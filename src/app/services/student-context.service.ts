// src/app/services/student-context.service.ts
import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs'; // <-- REMOVED

@Injectable({ providedIn: 'root' })
export class StudentContextService {
  // ✅ SIMPLIFIED: Using a simple private property instead of BehaviorSubject
  private _studentId: number | null = null;
  // studentId$ = this._studentId.asObservable(); // <-- REMOVED

  setStudentId(id: number | null) {
    this._studentId = id;
  }

  getStudentId(): number | null {
    return this._studentId;
  }
}