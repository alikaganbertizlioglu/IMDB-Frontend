import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { Movie } from '../../models/movie.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,private authService:AuthService) { }

  getAllMovies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/public/api/movies/getall`);
  }

  getMovieById(movieId:number){
    return this.http.get<any>(`${this.apiUrl}/public/api/movies/get/${movieId}`);
  }

}
