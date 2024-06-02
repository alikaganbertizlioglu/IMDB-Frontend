import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AlertifyService } from '../../services/alertify/alertify.service';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] // Fixed styleUrls attribute name
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  countries!: any[];
  cities!: any[];
  selectedCountry: any;
  selectedCity: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.initRegisterFormValidations();
    this.getCountriesAndCities();
  }

  initRegisterFormValidations(){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  getCountriesAndCities(){
    this.http.get<any>('https://countriesnow.space/api/v0.1/countries')
    .subscribe(
      (response) => {
        this.countries = response.data;
      },
      (error) => {
        this.alertifyService.error('Error fetching countries:');
      }
    );
  }

  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    if (!password) return null;

    const hasNumber = /\d/.test(password);
    const hasNonAlphanumeric = /\W/.test(password);
    const valid = hasNumber && hasNonAlphanumeric;

    return valid ? null : { passwordInvalid: true };
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  onCountryChange(event: any) {
    const countryName = event.target.value;
    if (countryName) {
      this.selectedCountry = this.countries.find(country => country.country === countryName);
      this.selectedCity = null;
    }
  }

  submitForm() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          this.alertifyService.success(response.message);
        },
        (error) => {
          this.alertifyService.error('Registration failed.');
        }
      );
    }
  }
}
