import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addRating(ratingInput: { movieId: number, rating: number, userId: number }): Observable<any> {
    return this.http.post(this.apiUrl + '/api/ratings/add', ratingInput);
  }}
