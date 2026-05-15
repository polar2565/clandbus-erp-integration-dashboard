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

  login(payload: any) {

    return this.http.post(
      `${this.apiUrl}/login`,
      payload,
      {
        withCredentials: true
      }
    );
  }

  getOrders() {

    return this.http.get(
      `${this.apiUrl}/orders`,
      {
        withCredentials: true
      }
    );
  }

  updateOrder(payload: any) {

    return this.http.post(
      `${this.apiUrl}/update-order`,
      payload,
      {
        withCredentials: true
      }
    );
  }

  removeHold(payload: any) {

    return this.http.post(
      `${this.apiUrl}/remove-hold`,
      payload,
      {
        withCredentials: true
      }
    );
  }

  logout() {

    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true
      }
    );
  }
}
