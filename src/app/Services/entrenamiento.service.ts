import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InitTsp } from '../Models/InitTsp';
import { TspResponse } from '../Models/TspResponse';
@Injectable({
  providedIn: 'root'
})
export class EntrenamientoService {
  baseurl: string = 'http://localhost:8000/tsp';

  constructor(private http: HttpClient) { }

  postinit(InitTsp: InitTsp){
    return this.http.post<TspResponse>(this.baseurl+'/',InitTsp)
  }

  metodoPrueba() {
    return 0;
  }
}
