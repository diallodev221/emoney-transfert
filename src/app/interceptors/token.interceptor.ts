import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();
  if(authToken && !req.url.endsWith("/login")) {
    // Clone the request to add the authentication header.

    const newReq = req.clone({
      // headers: req.headers.append('Bearer ', authToken),
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(newReq);
  }
  return next(req);
}
