import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const instructorGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  //  Allow if logged in as instructor
  if (user && user.role === 'instructor') {
    return true;
  }

  //  Deny if not an instructor
  alert('Access denied. Only instructors can view this page.');
  router.navigateByUrl('/login');
  return false;
};
