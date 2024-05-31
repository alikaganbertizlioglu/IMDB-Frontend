import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'se3355-frontend-angular';
  constructor(private translateService:TranslateService){
    
    const browserLang = translateService.getBrowserLang();
    translateService.setDefaultLang(browserLang!);
  }
}
