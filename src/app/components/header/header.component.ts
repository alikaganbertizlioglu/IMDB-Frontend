import { Component, Renderer2, ViewChild, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('exampleModal') modal: any;
  searchQuery!: string;
  selectedOption: string = 'All'; // Default to 'All'
  searchMovieResults!:any[];
  searchActorResults!:any[];
  userName!: string;
  watchlist!:any[];
  apiUrl = environment.apiUrl;
  
  constructor(private authService: AuthService,private http:HttpClient,private renderer:Renderer2) {

  }

  ngOnInit(){
    this.isUserAuthenticated();
  }
  
  isUserAuthenticated():boolean{
    return this.authService.isAuthenticated();
  }

  getUserName(){
    return localStorage.getItem('userName');
  }

  logout(){
    this.authService.logout();
  }

  displayWatchlist(){
    const userId = localStorage.getItem('userId');
    this.http.get<any>(`${this.apiUrl}/api/watchlist/get/${userId}`).subscribe({
      next: (response) => {
        this.watchlist = response;
        this.openModal();
      },
      error: (error) => {
        console.error('An error occurred while fetching users watchlist', error);
      }
    });
  }

  openModal() {
    const modalEl = document.getElementById('exampleModal');
    this.renderer.addClass(modalEl, 'show');
    this.renderer.setStyle(modalEl, 'display', 'block');
  }

  closeModal() {
    const modalEl = document.getElementById('exampleModal');
    this.renderer.removeClass(modalEl, 'show');
    this.renderer.setStyle(modalEl, 'display', 'none');
  }


  selectSearchType(option: string) {
      this.selectedOption = option;
      console.log(this.selectSearchType);
      // You can add further logic here, such as triggering the search with the selected option
  }

  onSearch() {
    console.log('Searching for:', this.searchQuery);
    if(this.selectedOption!='Actor' && this.searchQuery!=''){
      this.http.get<any>(`${this.apiUrl}/public/api/movies/search/${this.searchQuery}`).subscribe({
      next: (response) => {
        this.searchMovieResults = response.movieList;
      },
      error: (error) => {
        console.error('An error occurred while searching movies', error);
      }
    });  
    }

    if(this.selectedOption!='Movie' && this.searchQuery!=''){
      this.http.get<any>(`${this.apiUrl}/public/api/actors/search/${this.searchQuery}`).subscribe({
      next: (response) => {
        this.searchActorResults = response.actorList;
      },
      error: (error) => {
        console.error('An error occurred while searching actors', error);
      }
    });  
    }
  }

}
