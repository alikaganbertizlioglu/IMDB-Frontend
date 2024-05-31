import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Movie } from '../../models/movie.model';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { RatingService } from '../../services/rating/rating.service';
import { AlertifyService } from '../../services/alertify/alertify.service';
declare var bootstrap: any;

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {
  public movie!:Movie;
  loading: boolean = false;
  rating!: number;

  
  constructor(
    private route: ActivatedRoute,
    private movieService:MovieService,
    private sanitizer: DomSanitizer,
    public spinnerService:SpinnerService,
    private ratingService:RatingService,
    private alertifyService:AlertifyService
    ){
  }

  ngOnInit(){
    const movieId:any = this.route.snapshot.paramMap.get('id');
    this.getMovieById(movieId);
  }

  getMovieById(movieId: number) {
    this.spinnerService.setLoadingState(true); 
    this.movieService.getMovieById(movieId).subscribe({
      next: (response) => {
        this.movie = response.data;
        this.spinnerService.setLoadingState(false); 
      },
      error: (error) => {
        console.error('An error occurred while fetching movies', error);
        this.spinnerService.setLoadingState(false); 
      }
    });
  }
  

  getVideoUrlSafely(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openRatePopUp() {
    const ratingModal = new bootstrap.Modal(document.getElementById('ratingModal'));
    ratingModal.show();
  }

  submitRating() {
    const userId = Number(localStorage.getItem('userId')); // Assuming you have user ID in local storage
    this.spinnerService.setLoadingState(true);
    this.ratingService.addRating({ movieId: this.movie.id, rating: this.rating, userId }).subscribe({
      next: (response) => {
        this.alertifyService.success(response.message);
        this.spinnerService.setLoadingState(false);
        this.getMovieById(this.movie.id);
      },
      error: (error) => {
        this.spinnerService.setLoadingState(false);
        this.alertifyService.error(error.error.message);
      }
    });
  }

}
