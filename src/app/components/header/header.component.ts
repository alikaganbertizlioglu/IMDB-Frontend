import { Component, Renderer2, ViewChild } from '@angular/core';
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


}
