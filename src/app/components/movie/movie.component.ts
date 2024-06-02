import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Movie } from '../../models/movie.model';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { RatingService } from '../../services/rating/rating.service';
import { AlertifyService } from '../../services/alertify/alertify.service';
import { AuthService } from '../../services/auth/auth.service';
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
    private alertifyService:AlertifyService,
    private authService:AuthService,
    private renderer:Renderer2,
    private router:Router
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
        this.alertifyService.error('An error occurred while fetching movies ');
        this.spinnerService.setLoadingState(false); 
      }
    });
  }
  

  getVideoUrlSafely(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
    if (this.authService.isAuthenticated()) {
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
    }else{
      this.closeModal();
      this.router.navigateByUrl('/login');
    }

  }

  formatViewers(numberOfViewer: number): string {
    return numberOfViewer.toLocaleString();
  }

}
