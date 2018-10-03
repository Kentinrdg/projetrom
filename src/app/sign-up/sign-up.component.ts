import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyAuthService } from '../services/auth.service';
import { User } from '../models/user.models';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;
  tool: string;

  newUser: User;

  constructor(private formBuilder: FormBuilder,
              private authService: MyAuthService,
              private router: Router) { }

  ngOnInit() {
    // Initialisation du formulaire
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      password2: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      pseudo: [null, [Validators.required]],
      ville: [null, [Validators.required]]
    });
  }

  // Soumission du formulaire
  // 1. Recup mail
  // 2. Recup mdp
  // 3. AuthService create new User et le router renvoi vers books
  onSubmit() {
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    const password2 = this.signupForm.get('password2').value;
    const pseudo = this.signupForm.get('pseudo').value;
    const ville = this.signupForm.get('ville').value;

    if (password === password2) {
      this.authService.setCustomData(pseudo, email, ville);
      this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['/showactivity']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
   // this.newUser = new User(email, password, pseudo);
   // this.authService.createNewPersonnalUser(this.newUser);
  } else {
    this.tool = '    <p>Les mots de passes ne correspondent pas.</p>';
  }
}
}