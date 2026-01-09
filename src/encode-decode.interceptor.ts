import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AesService } from './views/shared/services/aes.service';
import { catchError, map } from 'rxjs';

export const encodeDecodeInterceptor: HttpInterceptorFn = (req, next) => {
  let aes = inject(AesService);
  // console.log(req.body instanceof FormData);
  // console.log(req.params);
  // console.log(req.params);
  console.log(req.body);
  
  if((req.body) && !(req.body instanceof FormData) && req.params.keys.length === 0
){
    let encrypPayload = aes.encrypt(JSON.stringify(req.body));
    // let encryptRequest : any;
    // if(req.body){
      let encryptRequest = req.clone({
        body : {data : encrypPayload},
      });
    // }else {
    //   encryptRequest = req.clone({
    //     params : {data : encrypPayload},
    //   });
    // }
    // console.log(encryptRequest);
    
    return next(encryptRequest).pipe(
      map((event) => {
        if (event instanceof HttpResponse){
          const responseBody = event.body as EncryptedResponse;
          if(responseBody?.Data){
            return event.clone({
              body : JSON.parse(aes.decrypt(responseBody.Data))
            })
          }
        }
        return (event)
      }),
      catchError((err ) => {
        console.log(err);
        throw err
      })
    )
  }
  return next(req);
};

interface EncryptedResponse {
  Data: string; // The encrypted data field in the response body
}