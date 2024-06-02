import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../../services/alertify/alertify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router,private alertifyService:AlertifyService) { }

   ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submitForm() {
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        if (response.token != null) {
          const token = response.token;
          const userId = response.userId;
          const userName = response.name;
          localStorage.setItem('userName', userName);
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', token);
          this.router.navigateByUrl("/home");
        }
      },
      (error) => {
        this.alertifyService.error("Error: " + error.status);
      }
    );
  }
  

  loginWithGoogle(){
    alert("not implemented due to credit card is mandatory to registration into google cloud");
  }
}
