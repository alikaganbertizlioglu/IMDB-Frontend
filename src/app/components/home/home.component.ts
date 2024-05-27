import { Component } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private apiUrl = environment.apiUrl;
  movies!: any[];
  responsiveOptions!: any[];

  constructor(private http: HttpClient, private authService: AuthService,private router:Router,private movieService:MovieService) {}

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 4,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '547px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.movieService.getAllMovies().subscribe({
      next: (response) => {
        this.movies = response.movieList;
      },
      error: (error) => {
        console.error('An error occurred while fetching movies', error);
      }
    });
  }

  test() {
    this.http.get(this.apiUrl + '/api/hello').subscribe(response => {
      console.log(response);
    });
  }

  navigateToMovie(movieId:number) {
    console.log(movieId);
    this.router.navigate(['movie', movieId]);
  }

  addMovieToWatchlist(movieId: number) {
    const userId = Number(localStorage.getItem('userId'));
    this.http.post(this.apiUrl + '/api/watchlist/add',{userId,movieId}).subscribe(response => {
      console.log(response);
    });  
  }
  
}
