import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {
  public movie?:Movie;
  constructor(
    private route: ActivatedRoute,
    private movieService:MovieService,
    private sanitizer: DomSanitizer
    ){
  }

  ngOnInit(){
    const movieId:any = this.route.snapshot.paramMap.get('id');
    this.getMovieById(movieId);
  }

  getMovieById(movieId:number){
    this.movieService.getMovieById(movieId).subscribe({
      next: (response) => {
        this.movie = response.data;
      },
      error: (error) => {
        console.error('An error occurred while fetching movies', error);
      }
    });  
  }

  getVideoUrlSafely(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
