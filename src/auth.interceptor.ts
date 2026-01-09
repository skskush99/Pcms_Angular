import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './views/shared/services/loader.service';
import { finalize } from 'rxjs';

let requCount = 0;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  let token = localStorage.getItem('token')
  requCount++;  
  loader.show();

  // Clone the request to add custom headers
  if(token){
    
    const clonedRequest = req.clone({
      setHeaders: {
        'Authorization': 'Bearer '.concat(token),
        // 'Content-Type': 'application/json',
        // 'Content-Type': 'json',
        // 'Accept': 'application/json',
        'X-Frame-Options' : 'SAMEORIGIN',
        // 'Access-Control-Allow-Origin': ['103.203.138.228' , '10.70.236.252'],
        'Access-Control-Allow-Credentials':'true',
        'Access-Control-Allow-Methods' : ['POST' , 'GET']
        // 'Authorization': 'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGl0ZXMudGVzdCIsIlVzZXJJZCI6IjEzMCIsIlVzZXJSb2xlIjoiU0EiLCJSb2xlSWQiOiIxIiwiVG9rZW4iOiJJemRyYXJrQkdINGhac2JDM2xsY3VvSW96ZFRnZXNLZnFRMjVCUFU5OHNjVE1KbDNWUkFOc25uK1I5R1RTYzR0bFBZc3hudUJDSEYxVTN1K2pPQncwQT09IiwiZXhwIjoxNzM5MzQ0MzU5LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAyIn0.cilLroujMsUpTg9BLSDDoEW6Pj2tW3euINplWPQ1F7g',
        
      }
    });

    return next(clonedRequest).pipe(
      finalize(() => {
        requCount--;
        if (requCount === 0) {
          loader.hide();
        }
      })
    );
  }
  
  return next(req).pipe(
    finalize(() => {
      requCount--;
      if (requCount === 0) {
        loader.hide();
      }
    })
  );
};
