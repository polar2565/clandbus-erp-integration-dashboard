import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AcumaticaService {

  private apiUrl =
    'https://localhost:7004/api/Acumatica';

  constructor(
    private http: HttpClient
  ) {
  }

  login() {

    return this.http.post(
      `${this.apiUrl}/login`,
      {}
    );
  }

  getOrders() {

    return this.http.get(
      `${this.apiUrl}/orders`
    );
  }

  updateOrder(payload: any) {

    return this.http.post(
      `${this.apiUrl}/update-order`,
      payload
    );
  }

  removeHold(payload: any) {

    return this.http.post(
      `${this.apiUrl}/remove-hold`,
      payload
    );
  }

  logout() {

    return this.http.post(
      `${this.apiUrl}/logout`,
      {}
    );
  }
}
