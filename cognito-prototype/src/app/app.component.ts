import { Component } from '@angular/core';
import { AmplifyService }  from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public amplifyService: AmplifyService) {
    this.amplifyService = amplifyService;

    this.amplifyService.auth();

    this.amplifyService.authStateChange$
        .subscribe(authState => {
            this.signedIn = authState.state === 'signedIn';
            if (!authState.user) {
                this.user = null;
            } else {
                this.user = authState.user;
                this.greeting = "Hello " + this.user.username;
            }
        });
  }
  title = 'cognito-prototype';
  private user: any;
  private greeting: any;
  private signedIn: any;
}
