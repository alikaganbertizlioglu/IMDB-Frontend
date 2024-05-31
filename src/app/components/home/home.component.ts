import { Component, Renderer2 } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { Movie } from '../../models/movie.model';
import { AlertifyService } from '../../services/alertify/alertify.service';
import { RatingService } from '../../services/rating/rating.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private apiUrl = environment.apiUrl;
  movies!: Movie[];
  responsiveOptions!: any[];
  movieIdToRate!:number;
  rating!: number;

  constructor(private http: HttpClient, private authService: AuthService,private router:Router,private movieService:MovieService,
    private alertifyService:AlertifyService,private ratingService:RatingService,public spinnerService:SpinnerService,private renderer:Renderer2) {}

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
    this.getAllMovies();
  }


  getAllMovies(){
    this.movieService.getAllMovies().subscribe({
      next: (response) => {
        this.movies = response.data;
      },
      error: (error) => {
        console.error('An error occurred while fetching movies', error);
      }
    });
  }



  navigateToMovie(movieId:number) {
    console.log(movieId);
    this.router.navigate(['movie', movieId]);
  }

  addMovieToWatchlist(movieId: number) {
    if(!this.authService.isAuthenticated()){
      this.router.navigateByUrl('/login');
    }else{
      const userId = Number(localStorage.getItem('userId'));
      this.http.post(this.apiUrl + '/api/watchlist/add', { userId, movieId }).subscribe({
        next: (response) => {
          this.alertifyService.success("Movie succesfully added into watchlist");
          console.log(response); // Log successful response
        },
        error: (error) => {
          this.alertifyService.error(error.error)
        }
      });
    }
  }

  openRatePopUp(movieId: number) {
    this.movieIdToRate = movieId;
    this.openModal();
  }

  openModal() {
    const modalEl = document.getElementById('ratingModal');
    this.renderer.addClass(modalEl, 'show');
    this.renderer.setStyle(modalEl, 'display', 'block');
  }

  closeModal() {
    const modalEl = document.getElementById('ratingModal');
    this.renderer.removeClass(modalEl, 'show');
    this.renderer.setStyle(modalEl, 'display', 'none');
  }

  submitRating() {
    if (!this.authService.isAuthenticated()) {
      this.closeModal();
      this.router.navigateByUrl('/login');
    }
    else{
      const userId = Number(localStorage.getItem('userId'));
      this.spinnerService.setLoadingState(true);
      this.ratingService.addRating({ movieId: this.movieIdToRate, rating: this.rating, userId }).subscribe({
        next: (response) => {
          this.alertifyService.success(response.message);
          this.spinnerService.setLoadingState(false);
          this.getAllMovies();
          this.rating = 5;
        },
        error: (error) => {
          this.spinnerService.setLoadingState(false);
          this.alertifyService.error(error.error.message);
        }
      });
    }
  }
  
  
}
