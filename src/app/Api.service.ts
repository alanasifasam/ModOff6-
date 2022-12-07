import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api: string = 'https://localhost:44351/V1/Cadastro';
  private options: any = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }) };

  constructor(private http: HttpClient) {
    
  }

  createData(data: any) {
    return this.http.post(`${this.api}/PostAsync`, JSON.stringify(data), this.options);
  }

  readData() {
    return this.http.get(`${this.api}/GetAsync`);
  }
  
  updateData(data: any) {
    return this.http.put(`${this.api}posts/1`, JSON.stringify(data), this.options);
  }

  deleteData() {
    return this.http.delete(`${this.api}posts/1`);
  }

}
