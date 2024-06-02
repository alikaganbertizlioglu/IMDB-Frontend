import { Component, Renderer2, ViewChild, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from '../../services/alertify/alertify.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('exampleModal') modal: any;
  searchQuery!: string;
  selectedOption!: string; // Default to 'All'
  searchMovieResults!:any[];
  searchActorResults!:any[];
  userName!: string;
  watchlist!:any[];
  apiUrl = environment.apiUrl;
  
  constructor(private authService: AuthService,private http:HttpClient,private renderer:Renderer2,public spinnerService:SpinnerService,
    private alertifyService:AlertifyService,
    protected translateService:TranslateService) {
      
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
    this.openModal();
    this.spinnerService.setLoadingState(true);
    this.http.get<any>(`${this.apiUrl}/api/watchlist/get/${userId}`).subscribe({
      next: (response) => {
        this.spinnerService.setLoadingState(false);
        this.watchlist = response;
      },
      error: (error) => {
        this.alertifyService.error('An error occurred while fetching users watchlist:'+  error);
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
  }

  onSearch() {
    if(this.selectedOption!='Actor' && this.searchQuery!=''){
      this.spinnerService.setLoadingState(true);
      this.http.get<any>(`${this.apiUrl}/public/api/movies/search/${this.searchQuery}`).subscribe({
      next: (response) => {
        this.spinnerService.setLoadingState(false);
        this.searchMovieResults = response.movieList;
      },
      error: (error) => {
        this.spinnerService.setLoadingState(false);

        this.alertifyService.error('An error occurred while searching movies '+ error);
      }
    });  
    }

    if(this.selectedOption!='Movie' && this.searchQuery!=''){
      this.http.get<any>(`${this.apiUrl}/public/api/actors/search/${this.searchQuery}`).subscribe({
      next: (response) => {
        this.searchActorResults = response.actorList;
      },
      error: (error) => {
        this.alertifyService.error('An error occurred while searching actors ' + error);
      }
    });  
    }
  }

  chooseLang(lang:string){
    this.translateService.use(lang);
  }

}
