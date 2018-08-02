import { Injectable } from '@angular/core';
import { KuiAuthenticationModule } from './authentication.module';

@Injectable({
  providedIn: KuiAuthenticationModule
})
export class AuthenticationService {

  constructor() { }
}
