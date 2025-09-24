import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  // Get the required profile from route data, e.g. { data: { requiredProfile: 'admin' } }
  const requiredProfiles: string[] = route.data?.['requiredProfiles'];
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // Not logged in
    return false;
  }

  if (requiredProfiles.length = 0) {
    // No profile restriction, allow access
    return true;
  }

  // Check if the user's profile matches the required profile
  if (currentUser.profile && requiredProfiles.includes(currentUser.profile?.name)) {
    return true;
  }

  // Access denied
  return false;
};
