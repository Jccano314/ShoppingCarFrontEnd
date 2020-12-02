import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { BASE_API_URL } from 'src/app/shared/http/global';
import { User } from '../../models/user/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../models/role/role.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  /**
   * Permite la configuración de los campos del formulario
   */
  public formBuilder: FormBuilder;

  /**
   * Permite crear grupos de controles para un formulario
   */
  public frmGroup: FormGroup;

  /**
   * Observable de tipo usuario
   */
  public users$: Observable<User[]>;

  /**
   * Observable de tipo usuario
   */
  public roles$: Observable<Role[]>;

  /**
   * Subscripción a los observables
   */
  public destroy$: Subject<boolean>;

  /**
   * Columnas de la tabla
   */
  public displayedColumns: string[] = ['id', 'name', 'dataCreate', 'role.name', 'delete', 'edit'];

  /**
   * Fuente de datos de usuarios
   */
  public dataSource: MatTableDataSource<User>;

  /**
   * Valida si se crea o edita un registro
   */
  public idUser: number;

  /**
   * Decorador para ordenamiento de la tabla
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Crea una nueva instancia de @see UsersComponent
   * @param formBuilder Permite la configuración de los campos del formulario
   */
  public constructor(formBuilder: FormBuilder) {
    this.users$ = new Observable<User[]>();
    this.roles$ = new Observable<Role[]>();
    this.destroy$ = new Subject();
    this.dataSource = new MatTableDataSource<User>();

    this.formBuilder = formBuilder;
    this.frmGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(512)]],
      role: ['', Validators.required],
    });

    this.idUser = 0;
  }

  /**
   * Al iniciarse el componente
   */
  public ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  /**
   * Al destruirse el componente
   */
  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  /**
   * Carga los usuarios del sistema
   */
  public loadUsers() {
    this.users$ = ajax.getJSON<User[]>(BASE_API_URL.url + 'user')
      .pipe(
        map((users) => users.filter((user) => user.state)),
        takeUntil(this.destroy$),
      );

    this.users$.subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.sort = this.sort;
    });

  }

  /**
   * Carga los roles del sistema
   */
  public loadRoles() {
    this.roles$ = ajax.getJSON<Role[]>(BASE_API_URL.url + 'role')
      .pipe(
        map((roles) => roles.filter((role) => role.state)),
        takeUntil(this.destroy$),
      );
  }

  /**
   * Guardar información
   */
  public onSubmit() {
    if (this.frmGroup.invalid) {
      return false;
    }

    const form = this.frmGroup.value;

    const user: User = {
      name: form.name,
      password: form.password,
      state: true,
      role: {
        id: form.role,
      },
    };

    if (this.idUser > 0) {
      ajax({
        url: BASE_API_URL.url + 'user/' + this.idUser,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: user,
      }).pipe(
        takeUntil(this.destroy$),
      ).subscribe(() => {
        alert('Registro actualizado con exito');
        this.loadUsers();
      });
    } else {
      ajax({
        url: BASE_API_URL.url + 'user',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: user,
      }).pipe(
        takeUntil(this.destroy$),
      ).subscribe(() => {
        alert('Registro guardado con exito');
        this.loadUsers();
      });
    }
  }

  /**
   * Elimina un usuario
   * @param id Identificador del usuario a eliminar
   */
  public deleteUser(id: number) {
    ajax({
      url: BASE_API_URL.url + 'user/' + id,
      method: 'DELETE',
    }).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => {
      alert('Registro eliminado con exito');
      this.loadUsers();
    });
  }

  /**
   * Cambia de usuario
   * @param id Identificador del usuario
   */
  public changeUser(row: any) {
    this.idUser = row.id;
    this.frmGroup.controls.name.setValue(row.name);
    this.frmGroup.controls.password.setValue(row.password);
    this.frmGroup.controls.role.setValue(row.role.id);
  }

}
