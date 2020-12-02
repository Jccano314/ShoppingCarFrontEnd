import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { takeUntil, tap } from 'rxjs/operators';
import { BASE_API_URL } from 'src/app/shared/http/global';
import { User } from '../../models/user/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  /**
   * Permite la configuración de los campos del formulario
   */
  public formBuilder: FormBuilder;

  /**
   * Permite crear grupos de controles para un formulario
   */
  public frmGroup: FormGroup;

  /**
   * A service that provides navigation and URL manipulation capabilities.
   */
  private readonly router: Router;
  /**
   * Provides access to information about a route associated with a component that is loaded in an outlet
   */
  private readonly activatedRoute: ActivatedRoute;

  /**
   * Crea una nueva instancia de @see LoginComponent
   */
  public constructor(formBuilder: FormBuilder, router: Router, activatedRoute: ActivatedRoute) {
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.formBuilder = formBuilder;
    this.frmGroup = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(512)]],
    });
  }

  /**
   * Al destruirse el componente
   */
  public ngOnDestroy(): void {
    this.destroyBackground();
  }

  /**
   * Al iniciarse el componente
   */
  public ngOnInit(): void {
    this.initBackground();
  }

  /**
   * Envia los datos del formulario
   */
  public onSubmit() {
    if (this.frmGroup.invalid) {
      return false;
    }

    const form = this.frmGroup.value;

    const login = {
      name: form.userName,
      password: form.password,
      state: true,
      role: {
        id: 1,
      },
    };

    const subs = ajax({
      url: BASE_API_URL.url + 'acceso',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: login,
    }).pipe(
      tap(() => console.log),
    ).subscribe((resp) => {
      console.log('RESPONSE', resp);
    });


    asyncScheduler.schedule(() => subs.unsubscribe(), 3000);
    this.router.navigate(['../welcome'], { relativeTo: this.activatedRoute });
  }

  /**
   * Se encarga de mostrar la imagen de fondo
   */
  initBackground(): void {
    document.body.style.backgroundImage = 'url(\'../../../../assets/images/background-image4.jpg\')';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
  }

  /**
   * Se encarga de reestablecer el background a las configuraciones por defecto
   */
  destroyBackground(): void {
    document.body.style.backgroundImage = 'none';
  }

}
